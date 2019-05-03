var bullet_bodieshape = new CANNON.Sphere(0.2);
var ballGeometry = new THREE.SphereGeometry(bullet_bodieshape.radius, 32, 32);
var shootDirection = new THREE.Vector3();
var shootVelo = 35;
var spherebody = new THREE.SphereGeometry(bullet_bodieshape.radius, 32, 32);
function getShootDir(targetVec){
    var vector = targetVec;
    targetVec.set(0,0,1);
    vector.unproject(camera);
    var ray = new THREE.Ray(sphereBody.position, vector.sub(sphereBody.position).normalize() );
    targetVec.copy(ray.direction);
}

document.addEventListener("click",function(e){
        var x = sphereBody.position.x;
        var y = sphereBody.position.y;
        var z = sphereBody.position.z;

        // var randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
        material2 = new THREE.MeshPhongMaterial( { color: "#FFFFFF" } );
        var ballMesh = new THREE.Mesh( ballGeometry, material2 );
        ballMesh.castShadow = true;
        ballMesh.receiveShadow = true;
        scene.add(ballMesh);
        bullets.push(ballMesh);

        // adding the bullet CANNON body
        var ballBody = new CANNON.Body({ mass: 1 });
        // console.log(ballBody)
        ballBody.addShape(bullet_bodieshape);
        ballBody.material = new CANNON.Material('bullet')
        world.add(ballBody);
        bullet_bodies.push(ballBody);
        // console.log(walls_bodies)
       for(var i = 0; i < walls_bodies.length; i++){
            var mat = new CANNON.ContactMaterial(
                ballBody.material, walls_bodies[i].material,
                {
                    friction: 10.0,
                    restitution: 0.0,
                    //contactEquationStiffness: 1e7,
                    contactEquationRelaxation: 100.0
                    //frictionEquationStiffness: 1
                    //frictionEquationRegularizationTime: 3
                }
            )
            world.addContactMaterial(mat)
        }
        // console.log(walls_bodies)
        getShootDir(shootDirection);



        ballBody.velocity.set(  shootDirection.x * shootVelo,
                                shootDirection.y * shootVelo,
                                shootDirection.z * shootVelo);

        // Move the ball outside the player sphere
        x += shootDirection.x * (sphereShape.radius*1.02 + bullet_bodieshape.radius);
        y += shootDirection.y * (sphereShape.radius*1.02 + bullet_bodieshape.radius);
        z += shootDirection.z * (sphereShape.radius*1.02 + bullet_bodieshape.radius);
        ballBody.position.set(x,y,z);
        ballMesh.position.set(x,y,z);

});
