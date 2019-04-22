

var PointerLockControls = function ( camera, cannonBody ) {

  var eyeYPos = 2; // eyes are 2 meters above the ground
  var velocityFactor = 0.2;
  var jumpVelocity = 20;
  var scope = this;

  var pitchObject = new THREE.Object3D();
  pitchObject.add( camera );

  var yawObject = new THREE.Object3D();
  yawObject.position.y = 2;
  yawObject.add( pitchObject );

  var quat = new THREE.Quaternion();

  var moveForward = false;
  var moveBackward = false;
  var moveLeft = false;
  var moveRight = false;

  var canJump = false;

  var contactNormal = new CANNON.Vec3(); // Normal in the contact, pointing *out* of whatever the player touched
  var upAxis = new CANNON.Vec3(0,1,0);
  cannonBody.addEventListener("collide",function(e){
      var contact = e.contact;

      // contact.bi and contact.bj are the colliding bodies, and contact.ni is the collision normal.
      // We do not yet know which one is which! Let's check.
      if(contact.bi.id == cannonBody.id)  // bi is the player body, flip the contact normal
          contact.ni.negate(contactNormal);
      else
          contactNormal.copy(contact.ni); // bi is something else. Keep the normal as it is

      // If contactNormal.dot(upAxis) is between 0 and 1, we know that the contact normal is somewhat in the up direction.
      if(contactNormal.dot(upAxis) > 0.5) // Use a "good" threshold value between 0 and 1 here!
          canJump = true;
  });

  var velocity = cannonBody.velocity;

  var PI_2 = Math.PI / 2;

  var onMouseMove = function ( event ) {

      if ( scope.enabled === false ) return;

      var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
      var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

      yawObject.rotation.y -= movementX * 0.002;
      pitchObject.rotation.x -= movementY * 0.002;

      pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );
  };

  var onKeyDown = function ( event ) {

      switch ( event.keyCode ) {

          case 38: // up
          case 87: // w
              moveForward = true;
              break;

          case 37: // left
          case 65: // a
              moveLeft = true; break;

          case 40: // down
          case 83: // s
              moveBackward = true;
              break;

          case 39: // right
          case 68: // d
              moveRight = true;
              break;

          case 32: // space
              if ( canJump === true ){
                  velocity.y = jumpVelocity;
              }
              canJump = false;
              break;
      }

  };

  var onKeyUp = function ( event ) {

      switch( event.keyCode ) {

          case 38: // up
          case 87: // w
              moveForward = false;
              break;

          case 37: // left
          case 65: // a
              moveLeft = false;
              break;

          case 40: // down
          case 83: // a
              moveBackward = false;
              break;

          case 39: // right
          case 68: // d
              moveRight = false;
              break;

      }

  };

  document.addEventListener( 'mousemove', onMouseMove, false );
  document.addEventListener( 'keydown', onKeyDown, false );
  document.addEventListener( 'keyup', onKeyUp, false );

  this.enabled = false;

  this.getObject = function () {
      return yawObject;
  };

  this.getDirection = function(targetVec){
      targetVec.set(0,0,-1);
      quat.multiplyVector3(targetVec);
  }

  // Moves the camera to the Cannon.js object position and adds velocity to the object if the run key is down
  var inputVelocity = new THREE.Vector3();
  var euler = new THREE.Euler();
  this.update = function ( delta ) {

      if ( scope.enabled === false ) return;

      delta *= 0.1;

      inputVelocity.set(0,0,0);

      if ( moveForward ){
          inputVelocity.z = -velocityFactor * delta;
      }
      if ( moveBackward ){
          inputVelocity.z = velocityFactor * delta;
      }

      if ( moveLeft ){
          inputVelocity.x = -velocityFactor * delta;
      }
      if ( moveRight ){
          inputVelocity.x = velocityFactor * delta;
      }

      // Convert velocity to world coordinates
      euler.x = pitchObject.rotation.x;
      euler.y = yawObject.rotation.y;
      euler.order = "XYZ";
      quat.setFromEuler(euler);
      inputVelocity.applyQuaternion(quat);
      //quat.multiplyVector3(inputVelocity);

      // Add to the object
      velocity.x += inputVelocity.x;
      velocity.z += inputVelocity.z;

      yawObject.position.copy(cannonBody.position);
  };
};


var width = window.innerWidth;
var height = window.innerHeight;

//Renderer
var renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

var controls;
var objects = [];
var raycaster;
var blocker = document.getElementById( 'blocker' );
var instructions = document.getElementById( 'instructions' );

var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

if ( havePointerLock ) {

    var element = document.body;

    var pointerlockchange = function ( event ) {

        if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

            controls.enabled = true;

            blocker.style.display = 'none';

        } else {

            controls.enabled = false;

            blocker.style.display = '-webkit-box';
            blocker.style.display = '-moz-box';
            blocker.style.display = 'box';

            instructions.style.display = '';

        }

    }

    var pointerlockerror = function ( event ) {
        instructions.style.display = '';
    }

    // Hook pointer lock state change events
    document.addEventListener( 'pointerlockchange', pointerlockchange, false );
    document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
    document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

    document.addEventListener( 'pointerlockerror', pointerlockerror, false );
    document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
    document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

    instructions.addEventListener( 'click', function ( event ) {
        instructions.style.display = 'none';

        // Ask the browser to lock the pointer
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

        if ( /Firefox/i.test( navigator.userAgent ) ) {

            var fullscreenchange = function ( event ) {

                if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {

                    document.removeEventListener( 'fullscreenchange', fullscreenchange );
                    document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

                    element.requestPointerLock();
                }

            }

            document.addEventListener( 'fullscreenchange', fullscreenchange, false );
            document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

            element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

            element.requestFullscreen();

        } else {

            element.requestPointerLock();

        }

    }, false );

} else {

    instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

}


//vars 
// var controlsEnabled = false;
// var moveForward = false;
// var moveBackward = false;
// var moveLeft = false;
// var moveRight = false;
// var canJump = false;
var prevTime = performance.now();
var velocity = new THREE.Vector3();
// var bounceNum = 0;
// var isMoving = false;
// var moveOk = false;
// var moveDir = 0;
var gameOver = false;
var clickPos = {
  x: 0,
  y: 0
};
var collide = [];
var scene = new THREE.Scene;
var cubeArr = [];
var maze = [];
var buttons = [];
var door = [];
var bullets = [];
var bullets_meshes = [];
var onKeyDown, onKeyUp;
var camera;
var point_on_screen;
var where_bullet_come_from_weapon;
var flashlight;
var ground;
var world;
var sphereBody;
var time = Date.now();
var physicsMaterial;

initCannon();
init();
render();

function initCannon(){
  // Setup our world
  world = new CANNON.World();
  world.quatNormalizeSkip = 0;
  world.quatNormalizeFast = false;

  var solver = new CANNON.GSSolver();

  world.defaultContactMaterial.contactEquationStiffness = 1e9;
  world.defaultContactMaterial.contactEquationRelaxation = 4;

  solver.iterations = 7;
  solver.tolerance = 0.1;
  var split = true;
  if(split)
      world.solver = new CANNON.SplitSolver(solver);
  else
      world.solver = solver;

  world.gravity.set(0,-20,0);
  world.broadphase = new CANNON.NaiveBroadphase();

  // Create a slippery material (friction coefficient = 0.0)
  physicsMaterial = new CANNON.Material("slipperyMaterial");
  var physicsContactMaterial = new CANNON.ContactMaterial(physicsMaterial,
                                                          physicsMaterial,
                                                          0.0, // friction coefficient
                                                          0.3  // restitution
                                                          );
  // We must add the contact materials to the world
  world.addContactMaterial(physicsContactMaterial);

  // Create a sphere
  var mass = 5, radius = 1.3;
  sphereShape = new CANNON.Sphere(radius);
  sphereBody = new CANNON.Body({ mass: mass });
  sphereBody.addShape(sphereShape);
  sphereBody.position.set(0,5,0);
  sphereBody.linearDamping = 0.9;
  world.add(sphereBody);

  // Create a plane
  var groundShape = new CANNON.Plane();
  var groundBody = new CANNON.Body({ mass: 0 });
  groundBody.addShape(groundShape);
  groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
  world.add(groundBody);
}

function init(){

  createMaze();
  createGround();

  createCamera();
  addGunLocationToCamera();
  addLightToCamera();

  setRendererOptions();
  // createEventListeners();

  raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

  // document.addEventListener( 'keydown', onKeyDown, false );
  // document.addEventListener( 'keyup', onKeyUp, false );
  document.addEventListener("mousedown", onMouseDown);
}

function createCamera(){
  // create perspective camera
  camera = new THREE.PerspectiveCamera(100, width / height, 0.1, 10000);
  controls = new PointerLockControls( camera, sphereBody );
  scene.add( controls.getObject() );
}

function addGunLocationToCamera(){
  point_on_screen = new THREE.Mesh(new THREE.BoxGeometry(.1, .1, .1), new THREE.MeshBasicMaterial({color: 0x5555ff }));
  point_on_screen.position.set(0,0,-20);
  camera.add(point_on_screen);

  where_bullet_come_from_weapon = new THREE.Object3D();
  where_bullet_come_from_weapon.position.set(2, -1, -5);
  camera.add(where_bullet_come_from_weapon);
}

function addLightToCamera(){
  //create player light
  flashlight = new THREE.AmbientLight(0x6d6dFF, 2, 100, 1);
  camera.add(flashlight);
  flashlight.position.set(3, 1, 3);
  flashlight.target = camera;
}

function createMaze(){
  maze.push([1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
  maze.push([1, 2, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]);
  maze.push([1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]);
  maze.push([1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]);
  maze.push([1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]);
  maze.push([1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]);
  maze.push([1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]);
  maze.push([1, 0, 1, 2, 1, 2, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1]);
  maze.push([1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1]);
  maze.push([1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1]);
  maze.push([1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]);
  maze.push([1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1]);
  maze.push([1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1]);
  maze.push([1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1]);
  maze.push([1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, 1, 0, 1]);
  maze.push([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1]);
  maze.push([1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1]);
  maze.push([1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0]);
  maze.push([1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]);
  maze.push([1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 2, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]);
  maze.push([1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]);
  maze.push([1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0]);
  maze.push([0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0]);
  maze.push([0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0]);
  maze.push([0, 0, 0, 1, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0]);
  
  
  //Create maze
  for (var i = 0; i < maze.length; i++) {
    for (var j = 0; j < 24; j++) {
      if (maze[i][j] == 1) {
        var cubeGeometry = new THREE.CubeGeometry(10, 10, 10);
        var cubeMaterial = new THREE.MeshLambertMaterial({
          color: 0xF0F0F0
        });
        var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.castShadow = true;
        cube.recieveShadow = true;
        cube.needsUpdate = true;
        cube.position.set(j * 10, 5, i * 10);
        collide.push(cube);
        objects.push(cube);
        scene.add(cube);
      }
      if (maze[i][j] == 2) {
        var cubeGeometry = new THREE.CubeGeometry(5, 5, 5);
        var cubeMaterial = new THREE.MeshLambertMaterial({
          color: 0xFF0000
        });
        var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.add(new THREE.PointLight(0xFF0000, 1, 10, .1));
        var cubeGeometry2 = new THREE.CubeGeometry(3, 3, 3);
        var cubeMaterial2 = new THREE.MeshLambertMaterial({
          color: 0x00FF00
        });
        var cube2 = new THREE.Mesh(cubeGeometry2, cubeMaterial2);
        cube2.add(new THREE.PointLight(0x00FF00, 1, 10, .1));
        cube.castShadow = true;
        cube.recieveShadow = true;
        cube.needsUpdate = true;
        cube2.position.set(j * 10, 1.5, i * 10);
        cube.position.set(j * 10, 2.5, i * 10);
        cube.name = "button" + i + j;
        buttons.push(cube);
        collide.push(cube);
        collide.push(cube2);
        objects.push(cube);
        objects.push(cube2);
        scene.add(cube);
        scene.add(cube2);
      }
      if (maze[i][j] == 3) {
        var cubeGeometry = new THREE.CubeGeometry(10, 10, 10);
        var cubeMaterial = new THREE.MeshLambertMaterial({
          color: 0xFF00FF
        });
        var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.add(new THREE.PointLight(0xFF00FF, 1, 10, .1));
        cube.castShadow = true;
        cube.recieveShadow = true;
        cube.needsUpdate = true;
        cube.position.set(j * 10, 5, i * 10);
        cube.name = "door";
        door.push(cube);
        collide.push(cube);
        objects.push(cube);
  
        scene.add(cube);
  
      }
  
    }
  }
}

function onMouseDown() {
    // let sphere_ball = new THREE.SphereGeometry(10, 8, 4);
    // let basic_mesh = new THREE.MeshBasicMaterial({color: "blue"});
    // let bullet = new THREE.Mesh(sphere_ball, basic_mesh);
    // bullet.position.copy(where_bullet_come_from_weapon.getWorldPosition()); // start position - the tip of the weapon
    // bullet.quaternion.copy(controls.getObject().quaternion); // apply camera's quaternion
    // scene.add(bullet);
    // bullets.push(bullet);  
    var x = sphereBody.position.x;
    var y = sphereBody.position.y;
    var z = sphereBody.position.z;
    var ballBody = new CANNON.Body({ mass: 1 });
    ballBody.addShape(ballShape);
    var randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
    material2 = new THREE.MeshPhongMaterial( { color: randomColor } );
    var ballMesh = new THREE.Mesh( ballGeometry, material2 );
    world.add(ballBody);
    scene.add(ballMesh);
    ballMesh.castShadow = true;
    ballMesh.receiveShadow = true;
    bullets.push(ballBody);
    bullets_meshes.push(ballMesh);
    getShootDir(shootDirection);
    ballBody.velocity.set(  shootDirection.x * shootVelo,
                            shootDirection.y * shootVelo,
                            shootDirection.z * shootVelo);

    // Move the ball outside the player sphere
    x += shootDirection.x * (sphereShape.radius*1.02 + ballShape.radius);
    y += shootDirection.y * (sphereShape.radius*1.02 + ballShape.radius);
    z += shootDirection.z * (sphereShape.radius*1.02 + ballShape.radius);
    ballBody.position.set(x,y,z);
    ballMesh.position.set(x,y,z);
}


// function createEventListeners(){
//   onKeyDown = function ( event ) {
//     switch ( event.keyCode ) {
//       case 38: // up
//       case 87: // w
//         moveForward = true;
//         break;
//       case 37: // left
//       case 65: // a
//         moveLeft = true; break;
//       case 40: // down
//       case 83: // s
//         moveBackward = true;
//         break;
//       case 39: // right
//       case 68: // d
//         moveRight = true;
//         break;
//       case 32: // space
//         if ( canJump === true ) velocity.y += 350;
//         canJump = false;
//         break;
//     }
//   };
//   onKeyUp = function ( event ) {
//     switch( event.keyCode ) {
//       case 38: // up
//       case 87: // w
//         moveForward = false;
//         break;
//       case 37: // left
//       case 65: // a
//         moveLeft = false;
//         break;
//       case 40: // down
//       case 83: // s
//         moveBackward = false;
//         break;
//       case 39: // right
//       case 68: // d
//         moveRight = false;
//         break;
//     }
//   };
// }

function createGround(){
  groundGeo = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
  groundGeo.rotateX( - Math.PI / 2 );
  for ( var i = 0, l = groundGeo.vertices.length; i < l; i ++ ) {
    var vertex = groundGeo.vertices[ i ];
    vertex.x += Math.random() * 20 - 10;
    vertex.y += Math.random() * 2;
    vertex.z += Math.random() * 20 - 10;
  }
  for ( var i = 0, l = groundGeo.faces.length; i < l; i ++ ) {
    var face = groundGeo.faces[ i ];
    face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
    face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
    face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
  }
  groundMat = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );
  ground = new THREE.Mesh( groundGeo, groundMat );
  scene.add( ground );
}

function setRendererOptions(){
  renderer.render(scene, camera);
  renderer.shadowMap.enabled = true;
  renderer.setClearColor( 0xffffff );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.render(scene, camera);
}

var ballShape = new CANNON.Sphere(20);
var ballGeometry = new THREE.SphereGeometry(ballShape.radius, 32, 32);
var shootDirection = new THREE.Vector3();
var shootVelo = 35;
// var projector = new THREE.Projector();
function getShootDir(targetVec){
    var vector = targetVec;
    targetVec.set(0,0,1);
    vector.unproject(camera);
    var ray = new THREE.Ray(sphereBody.position, vector.sub(sphereBody.position).normalize() );
    targetVec.copy(ray.direction);
}


var speed = 1000;
var clock = new THREE.Clock();
var bullet_delta = 0;
var dt = 1/60;
function render() {
  requestAnimationFrame(render);
  if (!gameOver) {
    
    if ( controls.enable ) {
      // raycaster.ray.origin.copy( controls.getObject().position );
      // raycaster.ray.origin.y -= 10;
      // var intersections = raycaster.intersectObjects( objects );
      // var isOnObject = intersections.length > 0;
      // var time = performance.now();
      // var delta = ( time - prevTime ) / 1000;
      // velocity.x -= velocity.x * 10.0 * delta;
      // velocity.z -= velocity.z * 10.0 * delta;
      // velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
      // if ( moveForward ) velocity.z -= 400.0 * delta;
      // if ( moveBackward ) velocity.z += 400.0 * delta;
      // if ( moveLeft ) velocity.x -= 400.0 * delta;
      // if ( moveRight ) velocity.x += 400.0 * delta;
      // if ( isOnObject === true ) {
      //   velocity.y = Math.max( 0, velocity.y );
      //   canJump = true;
      // }
      // controls.getObject().translateX( velocity.x * delta );
      // controls.getObject().translateY( velocity.y * delta );
      // controls.getObject().translateZ( velocity.z * delta );
      // if ( controls.getObject().position.y < 10 ) {
      //   velocity.y = 0;
      //   controls.getObject().position.y = 10;
      //   canJump = true;
      // }
      // prevTime = time;
      // bullet_delta = clock.getDelta();
      // bullets.forEach(b =>{ 
      //   // console.log(b.geometry.vertices[1]);
      //   b.translateZ(-speed * delta); // move along the local z-axis
      // });

      world.step(dt);

      // Update ball positions
      for(var i=0; i<bullets.length; i++){
          bullets_meshes[i].position.copy(bullets[i].position);
          bullets_meshes[i].quaternion.copy(bullets[i].quaternion);
      }
  }

    // var newLookAt = new THREE.Vector3().addVectors(camera.position, cameraLookAt);
    // camera.lookAt(newLookAt);
    // var moveOk = true;
    // var next = camMove.clone();
    // next.add(camStrafe.clone());
    // var camPos = camera.position.clone();
    // next.multiplyScalar(.01);
    // var direction = cameraLookAt.clone();

    // direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), ((moveDir * Math.PI) / 180));

    // var ray = new THREE.Raycaster(camPos.add(next), direction);
    // var collisionResults = ray.intersectObjects(collide);
    // if (collisionResults.length > 0) {
    //   if (collisionResults[0].distance < 5) {
    //     moveOk = false;
    //   }
    // }
    // if (moveOk) {

    //   camera.position.add(camMove);
    //   camera.position.add(camStrafe);

    // }
    /*
    if (isMoving || camera.position.y > 4.5 || camera.position.y < 4) {
      bounceNum += 2;
      camera.position.y = (Math.cos((bounceNum * 5) * Math.PI / 180)) + 4;
    }*/

    controls.update( Date.now() - time );
    renderer.render(scene, camera);

  } else {
    var text2 = document.createElement('div');
    text2.style.position = 'absolute';
    // text2.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
    text2.style.background = "#FFFFFF";
    text2.style.width = 100;
    text2.style.height = 100;
    text2.style.fontSize = "xx-large";
    text2.innerHTML = "You win!";
    text2.style.top = height / 2 + 'px';
    text2.style.left = width / 2 + 'px';
    document.body.appendChild(text2);
  }
}
