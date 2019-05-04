function createCamera(){
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );

    var l2ight = new THREE.PointLight(0xFF00FF, 1, 20, .1);
    camera.add(l2ight);
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0x000000, 0, 1000 );



    light = new THREE.DirectionalLight( 0xFFFFFF );
    light.position.set( 100, 100, 100 );
    light.target.position.set( 100, 0, 100 );
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

    controls = new PointerLockControls( camera , sphereBody );
    scene.add( controls.getObject() );
}
