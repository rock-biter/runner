import * as THREE from 'three'
import * as CANNON from 'cannon-es'

export default class Player {

    shape
    body

    physicsMaterial

    geometry
    mesh

    material = new CANNON.Material({friction: 0})

    constructor() {

        this.geometry = new THREE.BoxGeometry(2,4,2);
        this.material = new THREE.MeshNormalMaterial();
        this.mesh = new THREE.Mesh(this.geometry,this.material);
        this.mesh.position.set(0,10,0);

        this.shape = new CANNON.Box(new CANNON.Vec3(1,2,1));
        this.body = new CANNON.Body({mass: 0.3, shape: this.shape, fixedRotation: true});
        
        this.body.position.copy(this.mesh.position)

        this.setPhysicsMaterial(new CANNON.Material({friction: 0}));

    }

    setPhysicsMaterial(material) {
        this.body.material = material
    }
}