
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

        delta *= 0.5;

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

    var sphereShape;
    var sphereBody;
    var world;
    var physicsMaterial;
    var bullet_bodies=[];
    var bullets=[];
    var camera, scene, renderer;
    var geometry, material, mesh;
    var controls,time = Date.now();
    var ground;
    var maze = [];
    var buttons = [];
    var door = [];
    var point_on_screen;
    var where_bullet_come_from_weapon;
    var flashlight;
    var collide = [];
    var objects = [];
    var walls = [];
    var walls_bodies = [];
    var cannonDebugRenderer;

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

            initCannon();
            init();
            render();

            function initCannon(){
                // Setup our world

                world = new CANNON.World()
                world.gravity.set(0.0, -10.0, 0.0)
                world.broadphase = new CANNON.SAPBroadphase(world)
                world.defaultContactMaterial.friction = 0.0001
                world.defaultContactMaterial.restitution = 0.01
                world.defaultContactMaterial.contactEquationStiffness = 1000000.0
                world.defaultContactMaterial.frictionEquationStiffness = 100000.0
                // world = new CANNON.World();
                // world.quatNormalizeSkip = 0;
                // world.quatNormalizeFast = false;

                // var solver = new CANNON.GSSolver();

                // // world.defaultContactMaterial.contactEquationStiffness = 1e9;
                // // world.defaultContactMaterial.contactEquationRelaxation = 4;

                // world.defaultContactMaterial.friction = 0.0001
                // world.defaultContactMaterial.restitution = 0.01
                // world.defaultContactMaterial.contactEquationStiffness = 1000000.0
                // world.defaultContactMaterial.frictionEquationStiffness = 100000.0

                // solver.iterations = 7;
                // solver.tolerance = 0.1;
                // var split = true;
                // if(split)
                //     world.solver = new CANNON.SplitSolver(solver);
                // else
                //     world.solver = solver;

                // world.gravity.set(0,-10,0);
                // world.broadphase = new CANNON.NaiveBroadphase();

                // Create a slippery material (friction coefficient = 0.0)
                // physicsMaterial = new CANNON.Material("slipperyMaterial");
                // var physicsContactMaterial = new CANNON.ContactMaterial(physicsMaterial,
                //                                                         physicsMaterial,
                //                                                         0.0, // friction coefficient
                //                                                         0.3  // restitution
                //                                                         );
                // We must add the contact materials to the world
                // world.addContactMaterial(physicsContactMaterial);

                // Create a sphere
                var mass = 5, radius = 1.3;
                sphereShape = new CANNON.Sphere(radius);
                sphereBody = new CANNON.Body({ mass: mass });
                sphereBody.addShape(sphereShape);
                sphereBody.position.set(10,0,20);
                sphereBody.linearDamping = 0.9;
                world.add(sphereBody);

                // Create a plane
                var groundShape = new CANNON.Plane();
                var groundBody = new CANNON.Body({ mass: 0 });
                groundBody.addShape(groundShape);
                groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
                world.add(groundBody);
            }

            function init() {

                initUI();
                createCamera();
                createMaze();
                createGround();
                addGunLocationToCamera();
                setUpRenderer();

                window.addEventListener( 'resize', onWindowResize, false );
                cannonDebugRenderer = new THREE.CannonDebugRenderer(scene, world);

            }
            function createCamera(){
                camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );

                scene = new THREE.Scene();
                scene.fog = new THREE.Fog( 0x000000, 0, 1000 );

                var ambient = new THREE.AmbientLight( 0x111111 );
                scene.add( ambient );

                light = new THREE.SpotLight( 0xffffff );
                light.position.set( 10, 30, 20 );
                light.target.position.set( 0, 0, 0 );
                if(true){
                    light.castShadow = true;

                    light.shadow.camera.near = 20;
                    light.shadow.camera.far = 50;//camera.far;
                    light.shadow.camera.fov = 40;

                    light.shadowMapBias = 0.1;
                    light.shadowMapDarkness = 0.7;
                    light.shadow.mapSize.width = 2*512;
                    light.shadow.mapSize.height = 2*512;

                    // light.shadowCameraVisible = true;
                }
                scene.add( light );

                controls = new PointerLockControls( camera , sphereBody );
                scene.add( controls.getObject() );
            }

            function setUpRenderer(){
                renderer = new THREE.WebGLRenderer({antialias: true});
                renderer.shadowMap.enabled = true;
                renderer.shadowMapSoft = true;
                renderer.setSize( window.innerWidth, window.innerHeight );
                renderer.setClearColor( scene.fog.color, 1 );

                document.body.appendChild(renderer.domElement);
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
                flashlight = new THREE.AmbientLight(0x6d6dFF, 2, 100, 2);
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
                var netCfg = {width: 10.0, height: 10.0, depth: 10.0}
                var smallCfg = {width: 5.0, height: 5.0, depth: 5.0}
                var innerCfg = {width: 3.0, height: 3.0, depth: 3.0}

                // for(var i = 0; i < 2; i++){
                //     netMesh = new THREE.Mesh(
                //         new THREE.CubeGeometry(netCfg.width, netCfg.height, netCfg.depth),
                //         new THREE.MeshLambertMaterial({color: 0xCCCCCC})
                //     )
                //     netMesh.position.y = netCfg.height / 2.0
                //     netMesh.position.x = i*7;
                //     // net
                //     scene.add(netMesh)
                //     walls.push(netMesh)
                // }

                // for(var i = 0; i < walls.length; i++){
                //     netBody = new CANNON.Body({mass: 0})
                //     console.log(netBody)
                //     netBody.addShape(
                //         new CANNON.Box(
                //             new CANNON.Vec3(netCfg.width/2, netCfg.height/2, netCfg.depth/2)
                //         )
                //     )
                //     netBody.position.set(walls[i].position.x, walls[i].position.y, walls[i].position.z)
                //     // netBody.quaternion.setFromEuler(Math.PI / 60.0, 0, 0)
                //     netBody.material = new CANNON.Material('wall')
                //     world.add(netBody)
                //     walls_bodies.push(netBody)
                //     // walls[i].position.set(
                //     //     netBody.position.x, netBody.position.y, netBody.position.z
                //     // )
                //     // walls[i].quaternion.set(
                //     //     netBody.quaternion.x, netBody.quaternion.y, netBody.quaternion.z, netBody.quaternion.w
                //     // )
        
        
                // }
                
                //Create maze
                for (var i = 0; i < maze.length; i++) {
                  for (var j = 0; j < 24; j++) {
                    if (maze[i][j] == 1) {
                        var cube = new THREE.Mesh(
                          new THREE.CubeGeometry(netCfg.width, netCfg.height, netCfg.depth),
                          new THREE.MeshLambertMaterial({color: 0xCCCCCC })
                        );
                        cube.castShadow = true;
                        cube.recieveShadow = true;
                        cube.needsUpdate = true;
                        cube.position.y = netCfg.height/2.0;
                        cube.position.x = j * 10;
                        cube.position.z = i*10;
                        scene.add(cube);
                        walls.push(cube)

                    }
                    if (maze[i][j] == 2) {

                    var cube = new THREE.Mesh(
                        new THREE.CubeGeometry(smallCfg.width, smallCfg.height, smallCfg.depth),
                        new THREE.MeshLambertMaterial({color: 0xFF0000 })
                    );

                    var cube2 = new THREE.Mesh(
                        new THREE.CubeGeometry(innerCfg.width, innerCfg.hieght, innerCfg.depth), 
                        new THREE.MeshLambertMaterial({ color: 0x00FF00 })
                    );
                    cube2.add(new THREE.PointLight(0x00FF00, 1, 10, .1));
                    cube.castShadow = true;
                    cube.recieveShadow = true;
                    cube.needsUpdate = true;

                    cube.position.y = smallCfg.height/2.0;
                    cube.position.x = j * 10;
                    cube.position.z = i*10;

                    cube2.position.y = innerCfg.height/2.0;
                    cube2.position.x = j * 10;
                    cube2.position.z = i*10;

                    cube.name = "button" + i + j;
                    cube2.name = "inner" + i + j;
                    scene.add(cube);
                    scene.add(cube2)
                    walls.push(cube)
                    walls.push(cube2)

                    }
                    if (maze[i][j] == 3) {

                    var cube = new THREE.Mesh(
                        new THREE.CubeGeometry(netCfg.width, netCfg.height, netCfg.depth),
                        new THREE.MeshLambertMaterial({color: 0xCCCCCC })
                    );
                    cube.castShadow = true;
                    cube.recieveShadow = true;
                    cube.needsUpdate = true;
                    cube.position.y = netCfg.height/2.0;
                    cube.position.x = j * 10;
                    cube.position.z = i*10;

                    cube.name = "door";

                    scene.add(cube);
                    walls.push(cube)
                
                    }
                
                  }
                }


                for(var i = 0; i < walls.length; i++){

                    netBody = new CANNON.Body({mass: 0})
                    if((walls[i].name).includes("button")){
                        netBody.addShape(
                            new CANNON.Box(
                                new CANNON.Vec3(smallCfg.width/2.0, smallCfg.height/2.0, smallCfg.depth/2.0)
                            )
                        )
                    }
                    else if((walls[i].name).includes("inner")){
                        netBody.addShape(
                            new CANNON.Box(
                                new CANNON.Vec3(innerCfg.width/2.0, innerCfg.height/2.0, innerCfg.depth/2.0)
                            )
                        )
                    }
                    else{
                        netBody.addShape(
                            new CANNON.Box(
                                new CANNON.Vec3(netCfg.width/2.0, netCfg.height/2.0, netCfg.depth/2.0)
                            )
                        )
                    }
                    netBody.position.set(walls[i].position.x, walls[i].position.y, walls[i].position.z)
                    // netBody.quaternion.setFromEuler(Math.PI / 60.0, 0, 0)
                    netBody.material = new CANNON.Material('wall')
                    world.add(netBody)
                    walls_bodies.push(netBody)
                    walls[i].position.set(
                        netBody.position.x, netBody.position.y, netBody.position.z
                    )
                    // walls[i].quaternion.set(
                    //     netBody.quaternion.x, netBody.quaternion.y, netBody.quaternion.z, netBody.quaternion.w
                    // )
        
        
                }

                for(var i = 0; i < walls.length; i++){
                    // Catch collide events
                    walls_bodies[i].addEventListener('collide', function(info) {
                        log('collide event')
                    })
                    // Catch endContact events
                    walls_bodies[i].addEventListener('endContact', function(info) {
                        log('endContact event')
                    })
                }



              }

              function createGround(){
                groundGeo = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
                groundGeo.applyMatrix(new THREE.Matrix4().makeRotationX( - Math.PI / 2 ));

                for ( var i = 0, l = groundGeo.faces.length; i < l; i ++ ) {
                  var face = groundGeo.faces[ i ];
                  face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
                  face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
                  face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
                }
                groundMat = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );
                ground = new THREE.Mesh( groundGeo, groundMat );
                ground.castShadow = true;
                ground.recieveShadow = true;
                scene.add( ground );
              }

            function onWindowResize() {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize( window.innerWidth, window.innerHeight );
            }
            
            function initUI() {
                // var el = document.createElement('div')
                // el.className = 'instruct'
                // el.textContent = 'S - shoot puck | R - reset puck | L/R arrows - rotate camera'
                // document.body.appendChild(el)

                el = document.createElement('div')
                el.id = 'log'
                el.className = 'log'
                document.body.appendChild(el)
            }

            function log(s) {
                console.log(s)
                var el = document.getElementById('log')
                s = el.innerHTML + s + '<br/>'
                el.innerHTML = s
            }

            var dt = 1/60;
            function render() {
                requestAnimationFrame( render );
                if(controls.enabled){
                    world.step(dt);

                    // Update bullet_bodies
                    for(var i=0; i<bullet_bodies.length; i++){
                        bullets[i].position.copy(bullet_bodies[i].position);
                        bullets[i].quaternion.copy(bullet_bodies[i].quaternion);
                    }

                }

                controls.update( Date.now() - time );
                cannonDebugRenderer.update()
                renderer.render( scene, camera );
                time = Date.now();


            }

            var bullet_bodieshape = new CANNON.Sphere(0.2);
            var ballGeometry = new THREE.SphereGeometry(bullet_bodieshape.radius, 32, 32);
            var shootDirection = new THREE.Vector3();
            var shootVelo = 35;
            function getShootDir(targetVec){
                var vector = targetVec;
                targetVec.set(0,0,1);
                vector.unproject(camera);
                var ray = new THREE.Ray(sphereBody.position, vector.sub(sphereBody.position).normalize() );
                targetVec.copy(ray.direction);
            }

            document.addEventListener("click",function(e){
                if(controls.enabled==true){
                    var x = sphereBody.position.x;
                    var y = sphereBody.position.y;
                    var z = sphereBody.position.z;

                    // var randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
                    material2 = new THREE.MeshPhongMaterial( { color: "#FFFFFF" } );
                    var ballMesh = new THREE.Mesh( ballGeometry, material2 );
                    ballMesh.castShadow = true;
                    ballMesh.receiveShadow = true;
                    scene.add(ballMesh);
                    bullets.push(ballMesh);

                    // adding the bullet CANNON body
                    var ballBody = new CANNON.Body({ mass: 1 });
                    // console.log(ballBody)
                    ballBody.addShape(bullet_bodieshape);
                    ballBody.material = new CANNON.Material('bullet')
                    world.add(ballBody);
                    bullet_bodies.push(ballBody);
                    // console.log(walls_bodies)
                    for(var i = 0; i < walls_bodies.length; i++){
                        var mat = new CANNON.ContactMaterial(
                            ballBody.material, walls_bodies[i].material,
                            {
                                friction: 10.0,
                                restitution: 0.0,
                                //contactEquationStiffness: 1e7,
                                contactEquationRelaxation: 100.0
                                //frictionEquationStiffness: 1
                                //frictionEquationRegularizationTime: 3
                            }
                        )
                        world.addContactMaterial(mat)
                    }
                    // console.log(walls_bodies)
                    getShootDir(shootDirection);



                    ballBody.velocity.set(  shootDirection.x * shootVelo,
                                            shootDirection.y * shootVelo,
                                            shootDirection.z * shootVelo);

                    // Move the ball outside the player sphere
                    x += shootDirection.x * (sphereShape.radius*1.02 + bullet_bodieshape.radius);
                    y += shootDirection.y * (sphereShape.radius*1.02 + bullet_bodieshape.radius);
                    z += shootDirection.z * (sphereShape.radius*1.02 + bullet_bodieshape.radius);
                    ballBody.position.set(x,y,z);
                    ballMesh.position.set(x,y,z);
                }
            });

