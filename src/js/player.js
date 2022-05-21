import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { BufferAttribute } from 'three'
import { Vector3 } from 'three'



export default class Player {

    shape
    body

    physicsMaterial

    geometry
    mesh

    material = new CANNON.Material({friction: 0})

    sparks = {
        geometry: null,
        material: null,
        mesh: null,
        count: 500
    }

    // static COLORS = ['#71CDE1','#647CD0','#F15A24','#FF8A65','#039BE5'];
    static COLORS = ['#647CD0','#F15A24','#FF8A65'];
    

    constructor() {

        this.geometry = new THREE.BoxGeometry(2,4,2);
        this.material = new THREE.MeshNormalMaterial();
        this.mesh = new THREE.Mesh(this.geometry,this.material);

        this.addSparks()

        this.mesh.position.set(0,10,0);

        this.shape = new CANNON.Box(new CANNON.Vec3(1,2,1));
        this.body = new CANNON.Body({mass: 0.3, shape: this.shape, fixedRotation: true});
        
        this.body.position.copy(this.mesh.position)

        this.setPhysicsMaterial(new CANNON.Material({friction: 0}));

    }

    setPhysicsMaterial(material) {
        this.body.material = material
    }

    addSparks() {

        const textureLoader = new THREE.TextureLoader()
        const texture = textureLoader.load('./public/images/particles/star_08.png')

        const geometry = new THREE.BufferGeometry()
        const material = new THREE.PointsMaterial({ 
            size: window.innerWidth < 890 ? 20 : 25, 
            sizeAttenuation: true, 
            transparent: true, 
            alphaMap: texture, 
            depthWrite: false,
            vertexColors: true,
            blending: THREE.AdditiveBlending 
        })

        const positions = new Float32Array(this.sparks.count * 3)
        const velocities = new Float32Array(this.sparks.count * 3)
        const colors = new Float32Array(this.sparks.count * 4)

        geometry.setAttribute('position', new THREE.BufferAttribute(positions,3) )
        geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities,3) )
        geometry.setAttribute('color', new THREE.BufferAttribute(colors,4) )

        const mesh = new THREE.Points(geometry,material)
        mesh.frustumCulled = false

        for(let i = 0; i < this.sparks.count; i++) {
            const z = (Math.random() - 0.5) * 1.2
            const y = -0.2
            const x = (Math.random() - 0.5) * 1.2
            positions.set([x,y,z],i*3)

            // const r = 0.4 + Math.random() * 0.6
            // const g = 0.4 + Math.random() * 0.6
            // const b = 0.4 + Math.random() * 0.6
            const colorIndex = Math.floor( Math.random() * Player.COLORS.length )
            const color = new THREE.Color( Player.COLORS[colorIndex] )
            console.log(Player.COLORS[colorIndex],colorIndex)
            colors.set([color.r,color.g,color.b,0],i*4)

            velocities.set([0,0,0],i*3)

        }
        console.log(velocities)
        positions.needsUpdate = true
        colors.needsUpdate = true
        velocities.needsUpdate = true

        this.sparks.geometry = geometry
        this.sparks.material = material
        this.sparks.mesh = mesh

        // this.mesh.add( mesh )


    }

    resetSparksAttribute() {

        const position = this.sparks.geometry.getAttribute('position')
        const velocity = this.sparks.geometry.getAttribute('velocity')
        const color = this.sparks.geometry.getAttribute('color')

        for(let i = 0; i < this.sparks.count; i++) {
            position.set([0,0,0],i*3)
            velocity.set([0,0,0],i*3)
            color.setW(i,0)
        }

        position.needsUpdate = true
        velocity.needsUpdate = true
        color.needsUpdate = true

    }
}