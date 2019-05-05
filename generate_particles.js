function createParticles(){
    particleGeometry = new THREE.Geometry();
    var px, py, pz;

    for(var i = 0; i < 1500; i++){
      px = (Math.random() * 1000) - 500;
      py = (Math.random() * 10);
      pz = (Math.random() * 1000) - 500;

      particleGeometry.vertices.push(new THREE.Vector3(px,py,pz));
    }

    var pMaterial = new THREE.PointCloudMaterial({color: 0x000000});

    var pCloud = new THREE.PointCloud(particleGeometry, material);
    scene.add(pCloud);
}