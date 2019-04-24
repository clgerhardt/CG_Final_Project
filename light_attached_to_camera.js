function addLightToCamera(){
    //create player light
    flashlight = new THREE.AmbientLight(0x6d6dFF, 2, 100, 2);
    camera.add(flashlight);
    flashlight.position.set(3, 1, 3);
    flashlight.target = camera;
}