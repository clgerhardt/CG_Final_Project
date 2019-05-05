function createCamera(){
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 5000 );


    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0xFFFFFF, 0, 300 );




    light = new THREE.DirectionalLight( 0xFFFFFF );
    light.position.set( -100, 100, 100 );
    light.target.position.set( 0, 10, 0 );
    if(true){
        light.castShadow = true;

        light.shadow.camera.near = 20;
        light.shadow.camera.far = 50;//camera.far;
        light.shadow.camera.fov = 170;

        light.shadowMapBias = 0.1;
        light.shadowMapDarkness = 0.7;
        light.shadow.mapSize.width = 2*512;
        light.shadow.mapSize.height = 2*512;

        // light.shadowCameraVisible = true;
    }
    scene.add( light );

    light2 = new THREE.PointLight(0xFFFFFF,1, 1000, .2 );
    light2.position.set(500,500,500);
    scene.add(light2);

    light3 = new THREE.PointLight(0xFDA600,1, 1000, .2 );
    light3.position.set(0,500,0);
    scene.add(light3);

    light3 = new THREE.PointLight(0x00AFFD,1, 1000, .2 );
    light3.position.set(1000,500,1000);
    scene.add(light3);

    light4 = new THREE.PointLight(0xFFFFFF, 1, 3000, .1);
    light3.position.set(1000,2000,1000);
    scene.add(light4);


    controls = new PointerLockControls( camera , sphereBody );
    scene.add( controls.getObject() );
}
