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

