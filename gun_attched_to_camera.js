function addGunLocationToCamera(){
    point_on_screen = new THREE.Mesh(new THREE.BoxGeometry(.1, .1, .1), new THREE.MeshBasicMaterial({color: 0x5555ff }));
    point_on_screen.position.set(0,0,-20);
    camera.add(point_on_screen);
    
    where_bullet_come_from_weapon = new THREE.Object3D();
    where_bullet_come_from_weapon.position.set(2, -1, -5);
    camera.add(where_bullet_come_from_weapon);
}