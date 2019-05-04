function createGround(){
   var textureLoader = new THREE.TextureLoader();

    var lava = textureLoader.load( './textures/Hardening_Lava_02.png' );
    lava.wrapS = THREE.RepeatWrapping;
    lava.wrapT = THREE.RepeatWrapping;
    lava.repeat.set( 2000/2, 2000/2 );

    groundGeo = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
    groundGeo.applyMatrix(new THREE.Matrix4().makeRotationX( - Math.PI / 2 ));

    groundMat = new THREE.MeshBasicMaterial( { map: lava, metalness: 0.25, roughness: 0.75 } );
    ground = new THREE.Mesh( groundGeo, groundMat );
    ground.castShadow = true;
    ground.recieveShadow = true;
    scene.add( ground );
  }
