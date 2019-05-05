function setUpRenderer(){
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = true;
    renderer.setSize( window.innerWidth, window.innerHeight );
    //renderer.setClearColor( scene.fog.color, 1 );

    document.body.appendChild(renderer.domElement);
}
