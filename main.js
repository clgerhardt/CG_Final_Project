var width = window.innerWidth;
var height = window.innerHeight;

//Renderer
var renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

//Camera vectors

var camMove = new THREE.Vector3(0, 0, 0),
  camStrafe = new THREE.Vector3(0, 0, 0);
var cameraLookAt = new THREE.Vector3(0, 0, -1);
var cameraRight = new THREE.Vector3(1, 0, 0);
var cameraUp = new THREE.Vector3().crossVectors(cameraRight, cameraLookAt);
var bounceNum = 0;
var isMoving = false;
var moveOk = false;
var moveDir = 0;
var gameOver = false;
var clickPos = {
  x: 0,
  y: 0
};
//add controls
document.addEventListener("mousemove", look, false);
document.addEventListener("click", click, false);
document.addEventListener("keydown", doKeyDown, false);
document.addEventListener("keyup", doKeyUp, false);

//Mouse variables
var firstMouseMove = true;
var oldMousePos = {
  x: 0,
  y: 0
};

function click(evt) {

  var ray = new THREE.Raycaster(camera.position, cameraLookAt);
  if (buttons.length > 0) {
    for (var buttonIndex = 0; buttonIndex < buttons.length; buttonIndex++) {
      var collisionResults = ray.intersectObject(buttons[buttonIndex]);
      console.log(collisionResults);
      if (collisionResults.length > 0) {
        scene.remove(scene.getObjectByName(buttons[buttonIndex].name));
        buttons.splice(buttonIndex, 1);
      }
    }
  } else {
    var collisionResults = ray.intersectObjects(door);
    if (collisionResults.length > 0) {
      scene.remove(scene.getObjectByName(door[0].name));
      gameOver = true;
      door.splice(0, 1);
    }

  }
}


//looking around
function look(evt) {
  if (firstMouseMove) {
    oldMousePos.x = evt.clientX;
    oldMousePos.y = evt.clientY;
    firstMouseMove = false;
    return;
  }
  var yaw = (oldMousePos.x - event.clientX) / 200.00;
  var pitch = (oldMousePos.y - event.clientY) / 400.00;
  cameraLookAt.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
  cameraRight.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
  cameraLookAt.applyAxisAngle(cameraRight, pitch);
  oldMousePos.x = event.clientX;
  oldMousePos.y = event.clientY;

}

//stop moving
function doKeyUp(evt) {
  var code = evt.keyCode; // Numerical code for key that was pressed.
  switch (code) {
    case 65: // left arrow key
      camStrafe.x = 0;
      camStrafe.y = 0;
      camStrafe.z = 0;
      isMoving = false;
      break;
    case 68: // right arrow key
      camStrafe.x = 0;
      camStrafe.y = 0;
      camStrafe.z = 0;
      isMoving = false;
      break;
    case 87: // up arrow key
      camMove.x = 0;
      camMove.y = 0;
      camMove.z = 0;
      isMoving = false;
      break;
    case 83: // down arrow key
      camMove.x = 0;
      camMove.y = 0;
      camMove.z = 0;
      isMoving = false;
      break;
  }
}

//start moving
function doKeyDown(evt) {

  var code = evt.keyCode; // Numerical code for key that was pressed.
  switch (code) {
    case 65: // left arrow key

      camStrafe.x = -cameraRight.x / 2.0;
      camStrafe.y = -cameraRight.y / 2.0;
      camStrafe.z = -cameraRight.z / 2.0;
      isMoving = true;
      moveDir = 90;

      break;
    case 68: // right arrow key

      camStrafe.x = cameraRight.x / 2.0;
      camStrafe.y = cameraRight.y / 2.0;
      camStrafe.z = cameraRight.z / 2.0;
      isMoving = true;
      moveDir = 270;
      break;
    case 87: // up arrow key
      camMove.x = cameraLookAt.x / 2.0;
      camMove.y = cameraLookAt.y / 2.0;
      camMove.z = cameraLookAt.z / 2.0;
      isMoving = true;
      moveDir = 0;
      break;
    case 83: // down arrow key

      camMove.x = -cameraLookAt.x / 2.0;
      camMove.y = -cameraLookAt.y / 2.0;
      camMove.z = -cameraLookAt.z / 2.0;
      isMoving = true;
      moveDir = 180;
      break;
    default:
      break;
  }
}
var collide = [];
var scene = new THREE.Scene;

// create scene object

var cubeArr = [];
var maze = [];
var buttons = [];
var door = [];
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

      scene.add(cube);

    }

  }
}
/*
var cubeGeometry = new THREE.CubeGeometry(30, 10, 5);
var cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xdd6666});
var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(0, 5 , 0);
  collide.push(cube);
scene.add(cube);
cubeGeometry = new THREE.CubeGeometry(5, 10, 30);
cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xdd6666});
cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(20, 5 , 0);
  collide.push(cube);
scene.add(cube);
*/
// create perspective camera
var camera = new THREE.PerspectiveCamera(100, width / height, 0.1, 10000);
camera.position.y = 50;
camera.position.z = 20;
camera.position.x = 20;
camera.lookAt(cube);
scene.add(camera);




//create player light
var flashlight = new THREE.AmbientLight(0x6d6dFF, 2, 100, 1);
camera.add(flashlight);
flashlight.position.set(3, 1, 3);
flashlight.target = camera;

renderer.render(scene, camera);




// create the view matrix
camera.up = new THREE.Vector3(0, 1, 0)
camera.lookAt(0, 0, 0);


//Add floor
var groundGeo = new THREE.PlaneBufferGeometry(10000, 10000);
var groundMat = new THREE.MeshLambertMaterial({
  color: 0x654321
});
groundMat.color.setHSL(0.095, 1, 0.75);

var ground = new THREE.Mesh(groundGeo, groundMat);
ground.position.y = 0;
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);
//Shadows
renderer.shadowMap.enabled = true;
renderer.render(scene, camera);
var cubeCenter = new THREE.Vector3(0, 0, 0);



function render() {
  if (!gameOver) {
    var newLookAt = new THREE.Vector3().addVectors(camera.position, cameraLookAt);
    camera.lookAt(newLookAt);
    var moveOk = true;
    var next = camMove.clone();
    next.add(camStrafe.clone());
    var camPos = camera.position.clone();
    next.multiplyScalar(.01);
    var direction = cameraLookAt.clone();

    direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), ((moveDir * Math.PI) / 180));

    var ray = new THREE.Raycaster(camPos.add(next), direction);
    var collisionResults = ray.intersectObjects(collide);
    if (collisionResults.length > 0) {
      if (collisionResults[0].distance < 5) {
        moveOk = false;
      }
    }
    if (moveOk) {

      camera.position.add(camMove);
      camera.position.add(camStrafe);

    }
    /*
    if (isMoving || camera.position.y > 4.5 || camera.position.y < 4) {
      bounceNum += 2;
      camera.position.y = (Math.cos((bounceNum * 5) * Math.PI / 180)) + 4;
    }*/


    renderer.render(scene, camera);
    requestAnimationFrame(render);
  } else {
    var text2 = document.createElement('div');
    text2.style.position = 'absolute';
    //text2.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
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

render();
