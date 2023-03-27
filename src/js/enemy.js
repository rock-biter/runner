import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import _ from 'lodash'
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils'

export default class Enemy {
	gameManager

	shape
	body

	physicsMaterial

	geometry
	mesh

	material = new CANNON.Material({ friction: 0 })

	sleep = false

	constructor(gameManager, position, velocity) {
		this.gameManager = gameManager

		// this.geometry = new THREE.BoxGeometry(1.8, 1.8, 1.8)
		this._setGeometry()
		this.material = new THREE.MeshStandardMaterial({ color: '#8e4500' })
		this.mesh = new THREE.Mesh(this.geometry, this.material)

		if (position) {
			this.mesh.position.copy(position)
		}

		const initialVelocity = new CANNON.Vec3(0, 0, 5)

		this.shape = new CANNON.Box(new CANNON.Vec3(0.9, 0.9, 0.9))
		this.body = new CANNON.Body({
			mass: 0,
			shape: this.shape,
			fixedRotation: true,
			velocity: initialVelocity,
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
		console.log('on enemy collide')
		if (this.sleep) return

		this.sleep = true

		if (this.gameManager.isStarted) {
			// console.log(this.gameManager)
			this.gameManager._APP.gameover = true
			this._deleteEnemy()
		}
	}

	_deleteEnemy() {
		// this.gameManager._W.removeBody(this.body)
		this.body.position.y += 500
		this.gameManager._S.remove(this.mesh)
		this.mesh.geometry.dispose()

		setTimeout(() => {
			this.gameManager._W.removeBody(this.body)
		}, 500)
	}

	_setGeometry(type = 'shit') {
		// this.geometry =

		const base = new THREE.BoxGeometry(1.8, 0.4, 1.8)
		base.translate(0, 0.21, 0)
		const mid = new THREE.BoxGeometry(1.2, 0.4, 1.2)
		mid.translate(0, 0.61, 0)
		const top = new THREE.BoxGeometry(0.5, 0.4, 0.5)
		top.translate(0, 1.01, 0)

		this.geometry = mergeBufferGeometries([base, mid, top])
	}
}
