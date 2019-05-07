function initCannon(){
    // Setup our world

    world = new CANNON.World()
    world.gravity.set(0.0, -48.0, 0.0)
    world.broadphase = new CANNON.SAPBroadphase(world)
    world.defaultContactMaterial.friction = 50;
    world.defaultContactMaterial.restitution = .1;
    world.defaultContactMaterial.contactEquationStiffness = 1000000.0;
    world.defaultContactMaterial.frictionEquationStiffness = 100000.0;
    // world = new CANNON.World();
    // world.quatNormalizeSkip = 0;
    // world.quatNormalizeFast = false;

    // var solver = new CANNON.GSSolver();

    // // world.defaultContactMaterial.contactEquationStiffness = 1e9;
    // // world.defaultContactMaterial.contactEquationRelaxation = 4;

    // world.defaultContactMaterial.friction = 0.0001
    // world.defaultContactMaterial.restitution = 0.01
    // world.defaultContactMaterial.contactEquationStiffness = 1000000.0
    // world.defaultContactMaterial.frictionEquationStiffness = 100000.0

    // solver.iterations = 7;
    // solver.tolerance = 0.1;
    // var split = true;
    // if(split)
    //     world.solver = new CANNON.SplitSolver(solver);
    // else
    //     world.solver = solver;

    // world.gravity.set(0,-10,0);
    // world.broadphase = new CANNON.NaiveBroadphase();

    // Create a slippery material (friction coefficient = 0.0)
    // physicsMaterial = new CANNON.Material("slipperyMaterial");
    // var physicsContactMaterial = new CANNON.ContactMaterial(physicsMaterial,
    //                                                         physicsMaterial,
    //                                                         0.0, // friction coefficient
    //                                                         0.3  // restitution
    //                                                         );
    // We must add the contact materials to the world
    // world.addContactMaterial(physicsContactMaterial);

    // Create a sphere
    var mass = 10, radius = .5;
    sphereShape = new CANNON.Sphere(radius);
    sphereBody = new CANNON.Body({ mass: mass });
    sphereBody.addShape(sphereShape);
    sphereBody.friction = 1;
    sphereBody.position.set(10,10,0);
    // sphereBody.position.set(0,10,630);
    // x: 0
    // y: 5
    // z: 630
    sphereBody.linearDamping = 0.9;
    world.add(sphereBody);

    // Create a plane
    var groundShape = new CANNON.Plane();
    var groundBody = new CANNON.Body({ mass: 0 });
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
    world.add(groundBody);
}
