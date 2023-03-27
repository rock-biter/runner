import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import _ from 'lodash'

export default class Enemy {
	gameManager

	shape
	body

	physicsMaterial

	geometry
	mesh

	material = new CANNON.Material({ friction: 0 })

	constructor(gameManager) {
		this.gameManager = gameManager

		this.geometry = new THREE.BoxGeometry(1.8, 1.8, 1.8)
		this.material = new THREE.MeshStandardMaterial({ color: '#F15A24' })
		this.mesh = new THREE.Mesh(this.geometry, this.material)

		this.mesh.position.set(0, 0.91, -20)

		this.shape = new CANNON.Box(new CANNON.Vec3(0.9, 0.9, 0.9))
		this.body = new CANNON.Body({
			mass: 0,
			shape: this.shape,
			fixedRotation: true,
		})

		this.body.position.copy(this.mesh.position)

		this.body.addEventListener(
			'collide',
			_.throttle(() => {
				this._onCollide()
			}, 5000)
		)

		this.setPhysicsMaterial(new CANNON.Material({ friction: 100 }))
	}

	setPhysicsMaterial(material) {
		this.body.material = material
	}

	_onCollide(e) {
		console.log('on enimy collide')

		if (this.gameManager.isStarted) {
			// console.log(this.gameManager)
			this.gameManager._APP.gameover = true
			this._deleteEnemy()
		}
	}

	_deleteEnemy() {
		this.gameManager._W.removeBody(this.body)
		this.gameManager._S.remove(this.mesh)
	}
}
