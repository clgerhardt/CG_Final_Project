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
    var smaccerMesh = [];
    var smaccerCollide = [];
    var checkPointMesh = [];
    var endPoint;
    var gameOver = false;
    var respawnPosition = {x:10 ,y:10 ,z:0};
    var blocker = document.getElementById( 'blocker' );
    var instructions = document.getElementById( 'instructions' );
    var music = document.getElementById("music");

    var fogColor;
    var dy;
    var score = 0;
    var particleGeometry;
    var clock;



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
                clock.start();
            } else {

                element.requestPointerLock();

            }

        }, false );

    } else {

        instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

    }
    function calculateColorRGB(height){
        var rgbNumPercentage = (100 - ((height/10)*100))/100;
        var rgbNum = 256 * rgbNumPercentage;
        var color = new THREE.Color(rgbNum,0,0);
        return color;
    }
    function moveParticle(){
        for(var i = 0; i < particleGeometry.vertices.length; i++){
            if( particleGeometry.vertices[i].y < 10){
                particleGeometry.vertices[i].add(new THREE.Vector3(0,.1,0));
            }
            else{
                particleGeometry.vertices[i].add(new THREE.Vector3(0,-10,0));
            }
        }
    }

    // calculate score as a function of time
    function calculateScore(){
        var time = clock.getElapsedTime();

        var timescore = (Math.cos(1/time)*10);

        score -= timescore;
        //log(score);

    }

    initCannon();
    init();
    render();

    function init() {
        createCamera();
        createMaze();
        createGround();
        createParticles();
        addGunLocationToCamera();
        setUpRenderer();

        clock = new THREE.Clock(false);

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
    var frameNumSmacc = 0;
    var timeSinceLastCall = Date.now();
    function render() {


        if(!gameOver){

        requestAnimationFrame( render );

        if(controls.enabled){
          if(Date.now() - timeSinceLastCall >= .167){
            world.step(dt);
            timeSinceLastCall = Date.now();



            // Update bullet_bodies
            for(var i=0; i<bullet_bodies.length; i++){
                bullets[i].position.copy(bullet_bodies[i].position);
                bullets[i].quaternion.copy(bullet_bodies[i].quaternion);
            }
            for(var j = 0; j < spinnersMesh.length; j++){
              spinnersMesh[j].quaternion.setFromEuler(new THREE.Euler( 0, (Math.PI / 6)+(frameNum+150.3112), 0, 'XYZ' ));
              spinnersCollide[j].quaternion.setFromEuler(0, (Math.PI / 6)+(frameNum+150.3112), 0);
              frameNum -= .002;
            }
            for(var j = 0; j < smaccerMesh.length; j++){
              smaccerMesh[j].quaternion.setFromEuler(new THREE.Euler( 0, (Math.PI / 6)+(frameNumSmacc+150.3112), 0, 'XYZ' ));
              smaccerCollide[j].quaternion.setFromEuler(0, (Math.PI / 6)+(frameNumSmacc+150.3112), 0);
              frameNumSmacc += .002;
            }

            if(sphereBody.position.y < 3){
              sphereBody.position.set(respawnPosition.x, respawnPosition.y, respawnPosition.z);
              sphereBody.velocity.set(0,0,0);
              var x = document.getElementById("death");
              x.play();
            }

          }
        }
        controls.update( Date.now() - time );

        // move particles
        moveParticle(particleGeometry);
        particleGeometry.verticesNeedUpdate = true;
        // cannonDebugRenderer.update()


        renderer.render( scene, camera );

        time = Date.now();

          renderer.render( scene, camera );
        }
      else{
        clock.stop();
        calculateScore();
        document.getElementById("score").textContent= score;
      }
    }
