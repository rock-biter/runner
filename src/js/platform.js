import * as THREE from 'three'
import * as CANNON from 'cannon-es'

export default class Platform {
	phongMaterial
	height
	depth
	gap

	mesh
	body

	constructor(x, velocity) {
		// console.log(velocity)
		let z = velocity.z ? Math.floor(Math.abs(velocity.z)) : 20

		this.phongMaterial = new THREE.MeshPhongMaterial({
			color: new THREE.Color(0.2, 0.2, 0.2),
			transparent: true,
			// opacity: 1,
			side: THREE.FrontSide,
		})

		this.phongMaterial.onBeforeCompile = (shader) => {
			shader.fragmentShader = shader.fragmentShader.replace(
				'vec4 diffuseColor = vec4( diffuse, opacity );',
				`
            float yCoord = (vViewPosition.z * 0.011) - 0.8;
            vec4 diffuseColor = vec4( diffuse, opacity - clamp(yCoord, 0.0, 1.0) );
            `
			)
		}

		this.depth = THREE.MathUtils.randInt(z / 4, z * 2.5) * 2
		this.gap = Math.floor(THREE.MathUtils.randInt(4, 4 + z * 0.2))

		this.height = 100

		let geometry = new THREE.BoxGeometry(2, this.height, this.depth)

		this.mesh = new THREE.Mesh(geometry, this.phongMaterial)
		// planeMesh.rotateX(-Math.PI / 2)
		this.mesh.receiveShadow = true
		this.mesh.position.set(0, -this.height / 2, -x - this.depth / 2)

		let halfDimension = new CANNON.Vec3(1, this.height / 2, this.depth / 2)
		let shape = new CANNON.Box(halfDimension)

		this.body = new CANNON.Body({ mass: 0, shape: shape }) //mass 0 mean static body not affetcet by forces nor velocity
		this.body.position.copy(this.mesh.position)
		this.body.allowSleep = true

		this.body.material = new CANNON.Material({ friction: 0 })
	}

	static COLORS = ['#71CDE1', '#647CD0', '#F15A24', '#FF8A65', '#039BE5']
}
