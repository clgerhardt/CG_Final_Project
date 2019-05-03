function createMaze(){

    maze.push([6, 1, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    maze.push([6, 1, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    maze.push([6, 1, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    maze.push([6, 1, 7, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 5, 0, 0, 0, 0, 0]);
    maze.push([0, 4, 0, 1, 1, 1, 1, 7, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 7]);
    maze.push([0, 0, 0, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 7]);
    maze.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7]);
    maze.push([0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7]);
    maze.push([0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7]);
    maze.push([0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 1, 0, 0, 0, 6, 1, 1, 7]);
    maze.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    maze.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    maze.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    maze.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    maze.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    maze.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    maze.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    maze.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    maze.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    maze.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    maze.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    var netCfg = {width: 10.0, height: 10.0, depth: 10.0}
    var smallCfg = {width: 5.0, height: 5.0, depth: 5.0}
    var innerCfg = {width: 3.0, height: 3.0, depth: 3.0}

    // for(var i = 0; i < 2; i++){
    //     netMesh = new THREE.Mesh(
    //         new THREE.CubeGeometry(netCfg.width, netCfg.height, netCfg.depth),
    //         new THREE.MeshLambertMaterial({color: 0xCCCCCC})
    //     )
    //     netMesh.position.y = netCfg.height / 2.0
    //     netMesh.position.x = i*7;
    //     // net
    //     scene.add(netMesh)
    //     walls.push(netMesh)
    // }

    // for(var i = 0; i < walls.length; i++){
    //     netBody = new CANNON.Body({mass: 0})
    //     console.log(netBody)
    //     netBody.addShape(
    //         new CANNON.Box(
    //             new CANNON.Vec3(netCfg.width/2, netCfg.height/2, netCfg.depth/2)
    //         )
    //     )
    //     netBody.position.set(walls[i].position.x, walls[i].position.y, walls[i].position.z)
    //     // netBody.quaternion.setFromEuler(Math.PI / 60.0, 0, 0)
    //     netBody.material = new CANNON.Material('wall')
    //     world.add(netBody)
    //     walls_bodies.push(netBody)
    //     // walls[i].position.set(
    //     //     netBody.position.x, netBody.position.y, netBody.position.z
    //     // )
    //     // walls[i].quaternion.set(
    //     //     netBody.quaternion.x, netBody.quaternion.y, netBody.quaternion.z, netBody.quaternion.w
    //     // )


    // }

    //Create maze
    for (var i = 0; i < maze.length; i++) {
      for (var j = 0; j < 24; j++) {
        if (maze[i][j] == 1) {
            var cube = new THREE.Mesh(
              new THREE.CubeGeometry(netCfg.width, netCfg.height, netCfg.depth),
              new THREE.MeshLambertMaterial({color: 0xCCCCCC })
            );
            cube.castShadow = true;
            cube.recieveShadow = true;
            cube.needsUpdate = true;
            cube.position.y = netCfg.height/2.0;
            cube.position.x = j * 10;
            cube.position.z = i*10;
            scene.add(cube);
            walls.push(cube)

        }
        if (maze[i][j] == 2) {


          var cube = new THREE.Mesh(
              new THREE.CubeGeometry(smallCfg.width, smallCfg.height, smallCfg.depth),
              new THREE.MeshLambertMaterial({color: 0xFF0000 })
          );

          var cube2 = new THREE.Mesh(
              new THREE.CubeGeometry(innerCfg.width, innerCfg.hieght, innerCfg.depth),
              new THREE.MeshLambertMaterial({ color: 0x00FF00 })
          );
          cube2.add(new THREE.PointLight(0x00FF00, 1, 10, .1));
          cube.castShadow = true;
          cube.recieveShadow = true;
          cube.needsUpdate = true;

          cube.position.y = smallCfg.height/2.0;
          cube.position.x = j * 10;
          cube.position.z = i*10;

          cube2.position.y = innerCfg.height/2.0;
          cube2.position.x = j * 10;
          cube2.position.z = i*10;

          cube.name = "button" + i + j;
          cube2.name = "inner" + i + j;
          scene.add(cube);
          scene.add(cube2)
          walls.push(cube)
          walls.push(cube2)


        }
        if (maze[i][j] == 3) {

        var cube = new THREE.Mesh(
            new THREE.CubeGeometry(netCfg.width, netCfg.height, netCfg.depth),
            new THREE.MeshLambertMaterial({color: 0xCCCCCC })
        );
        cube.castShadow = true;
        cube.recieveShadow = true;
        cube.needsUpdate = true;
        cube.position.y = netCfg.height/2.0;
        cube.position.x = j * 10;
        cube.position.z = i*10;

        cube.name = "door";

        scene.add(cube);
        walls.push(cube)


        }
        if (maze[i][j] == 4){
          var cube = new THREE.Mesh(
            new THREE.CubeGeometry(netCfg.width, netCfg.height, netCfg.depth),
            new THREE.MeshLambertMaterial({color: 0xCCCCCC })
          );
          cube.castShadow = true;
          cube.recieveShadow = true;
          cube.needsUpdate = true;
          cube.position.y = (netCfg.height/2.0) + 3;
          cube.position.x = j * 10;
          cube.position.z = i * 10;
          cube.rotation.x = Math.PI / 3;
          cube.name = "ramp" + i + j;
          scene.add(cube);
          walls.push(cube)
        }
        if (maze[i][j] == 5){
          var cube = new THREE.Mesh(
            new THREE.CubeGeometry(netCfg.width, netCfg.height, netCfg.depth),
            new THREE.MeshLambertMaterial({color: 0xCCCCCC })
          );
          cube.castShadow = true;
          cube.recieveShadow = true;
          cube.needsUpdate = true;
          cube.position.y = (netCfg.height/2.0) + 3;
          cube.position.x = j * 10;
          cube.position.z = i * 10;
          cube.rotation.x = Math.PI / 6;
          cube.name = "pmar" + i + j;
          scene.add(cube);
          walls.push(cube)
        }
        if (maze[i][j] == 6){
          var cube = new THREE.Mesh(
            new THREE.CubeGeometry(netCfg.width, netCfg.height, netCfg.depth),
            new THREE.MeshLambertMaterial({color: 0xCCCCCC })
          );
          cube.castShadow = true;
          cube.recieveShadow = true;
          cube.needsUpdate = true;
          cube.position.y = (netCfg.height/2.0) + 3;
          cube.position.x = j * 10;
          cube.position.z = i * 10;
          cube.rotation.z = Math.PI / 3;
          cube.name = "ramRight" + i + j;
          scene.add(cube);
          walls.push(cube)
        }
        if (maze[i][j] == 7){
          var cube = new THREE.Mesh(
            new THREE.CubeGeometry(netCfg.width, netCfg.height, netCfg.depth),
            new THREE.MeshLambertMaterial({color: 0xCCCCCC })
          );
          cube.castShadow = true;
          cube.recieveShadow = true;
          cube.needsUpdate = true;
          cube.position.y = (netCfg.height/2.0) + 3;
          cube.position.x = j * 10;
          cube.position.z = i * 10;
          cube.rotation.z = Math.PI / 6;
          cube.name = "ramLeft" + i + j;
          scene.add(cube);
          walls.push(cube)
        }
        if (maze[i][j] == 8){
          var cube = new THREE.Mesh(
            new THREE.CubeGeometry(netCfg.width*4, netCfg.height, netCfg.depth),
            new THREE.MeshLambertMaterial({color: 0xCCCCCC })
          );
          cube.castShadow = true;
          cube.recieveShadow = true;
          cube.needsUpdate = true;
          cube.position.y = (netCfg.height/2.0);
          cube.position.x = j * 10;
          cube.position.z = i * 10;
          cube.name = "longBoi" + i + j;
          scene.add(cube);
          walls.push(cube)
          spinnersMesh.push(cube);
        }

      }
    }


    for(var i = 0; i < walls.length; i++){

        netBody = new CANNON.Body({mass: 0})
        if((walls[i].name).includes("button")){
            netBody.addShape(
                new CANNON.Box(
                    new CANNON.Vec3(smallCfg.width/2.0, smallCfg.height/2.0, smallCfg.depth/2.0)
                )
            )
        }
        else if((walls[i].name).includes("inner")){
            netBody.addShape(
                new CANNON.Box(
                    new CANNON.Vec3(innerCfg.width/2.0, innerCfg.height/2.0, innerCfg.depth/2.0)
                )
            )
        }

        else if(walls[i].name.includes("ramp")){
            netBody.addShape(
                new CANNON.Box(
                    new CANNON.Vec3(netCfg.width/2.0, netCfg.height/2.0, netCfg.depth/2.0)
                )
            )
            netBody.quaternion.setFromEuler(Math.PI / 3, 0, 0)
        }
        else if(walls[i].name.includes("pmar")){
            netBody.addShape(
                new CANNON.Box(
                    new CANNON.Vec3(netCfg.width/2.0, netCfg.height/2.0, netCfg.depth/2.0)
                )
            )
            netBody.quaternion.setFromEuler(Math.PI / 6, 0, 0)
        }
        else if(walls[i].name.includes("ramRight")){
            netBody.addShape(
                new CANNON.Box(
                    new CANNON.Vec3(netCfg.width/2.0, netCfg.height/2.0, netCfg.depth/2.0)
                )
            )
            netBody.quaternion.setFromEuler(0, 0, Math.PI / 3);
        }
        else if(walls[i].name.includes("ramLeft")){
            netBody.addShape(
                new CANNON.Box(
                    new CANNON.Vec3(netCfg.width/2.0, netCfg.height/2.0, netCfg.depth/2.0)
                )
            )
            netBody.quaternion.setFromEuler(0, 0, Math.PI / 6);
        }
        else if(walls[i].name.includes("longBoi")){
            netBody.addShape(
                new CANNON.Box(
                    new CANNON.Vec3(netCfg.width*2, netCfg.height/2.0, netCfg.depth/2.0)
                )
            )
            netBody.fixedRotation = false;
            netBody.position.set(walls[i].position.x, walls[i].position.y, walls[i].position.z)
            spinnersCollide.push(netBody);
        }

        else{
            netBody.addShape(
                new CANNON.Box(
                    new CANNON.Vec3(netCfg.width/2.0, netCfg.height/2.0, netCfg.depth/2.0)
                )
            )


        }
        netBody.position.set(walls[i].position.x, walls[i].position.y, walls[i].position.z)


        netBody.material = new CANNON.Material('wall')
        world.add(netBody)
        walls_bodies.push(netBody)
        walls[i].position.set(
            netBody.position.x, netBody.position.y, netBody.position.z
        )

        // walls[i].quaternion.set(
        //     netBody.quaternion.x, netBody.quaternion.y, netBody.quaternion.z, netBody.quaternion.w
        // )


    }

    for(var i = 0; i < walls.length; i++){
        // Catch collide events
        walls_bodies[i].addEventListener('collide', function(info) {
            log('collide event')
        })
        // Catch endContact events
        walls_bodies[i].addEventListener('endContact', function(info) {
            log('endContact event')
        })
    }


  }

