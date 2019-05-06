function createParticles(){
    particleGeometry = new THREE.Geometry();
    var px, py, pz;

    for(var i = 0; i < 1500; i++){
      px = (Math.random() * 1000) - 500;
      py = (Math.random() * 10);
      pz = (Math.random() * 1000) - 500;

      particleGeometry.vertices.push(new THREE.Vector3(px,py,pz));
    }

    var pMaterial = new THREE.PointsMaterial({color: 0x808080});

    var points = new THREE.Points(particleGeometry, material);
    scene.add(points);
}