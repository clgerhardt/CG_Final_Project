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

    var spinnersMesh = [];
    var spinnersCollide = [];
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

                document.addEventListener( 'fullscreenchange', fullscreenchange, false );
                document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );


        }

    } else {

        instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

    }

    initCannon();
    init();
    render();

    function init() {

        initUI();
        createCamera();
        createMaze();
        createGround();
        addGunLocationToCamera();
        setUpRenderer();

        window.addEventListener( 'resize', onWindowResize, false );
        //cannonDebugRenderer = new THREE.CannonDebugRenderer(scene, world);

    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    }


    var dt = 1/60;
    var frameNum = 0;
    function render() {


        requestAnimationFrame( render );
        if(controls.enabled){
            world.step(dt);

            // Update bullet_bodies
            for(var i=0; i<bullet_bodies.length; i++){
                bullets[i].position.copy(bullet_bodies[i].position);
                bullets[i].quaternion.copy(bullet_bodies[i].quaternion);
            }

            for(var j = 0; j < spinnersMesh.length; j++){
              spinnersMesh[j].rotation.y += .01;
              spinnersCollide[j].quaternion.setFromEuler(0, (Math.PI / 6)+(frameNum+150.3112), 0);
              frameNum += .01;
            }


        }

        controls.update( Date.now() - time );

        renderer.render( scene, camera );
        time = Date.now();


    }

