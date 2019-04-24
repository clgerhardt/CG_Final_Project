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