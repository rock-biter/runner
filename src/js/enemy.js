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

	constructor(gameManager, type = 'shit', position, velocity) {
		this.gameManager = gameManager

		// this.geometry = new THREE.BoxGeometry(1.8, 1.8, 1.8)
		this._setGeometry(type)
		this.material = new THREE.MeshStandardMaterial({
			color: '#8e4500',
			flatShading: true,
		})
		this.mesh = new THREE.Mesh(this.geometry, this.material)

		if (position) {
			this.mesh.position.copy(position)
		}

		if (type === 'ballshit') {
			this.mesh.position.setY(Math.random() > 0.5 ? 3 : 6)
		}

		const initialVelocity = velocity || new CANNON.Vec3(0, 0, 0)

		this.shape = new CANNON.Box(new CANNON.Vec3(0.9, 0.9, 0.9))
		this.body = new CANNON.Body({
			mass: 1,
			shape: this.shape,
			fixedRotation: true,
			velocity: initialVelocity,
			type: velocity ? CANNON.Body.KINEMATIC : CANNON.Body.STATIC,
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

	_setGeometry(type = 'ballshit') {
		// this.geometry =

		switch (type) {
			case 'shit':
				this.geometry = this._getShitGeometry()
				break
			case 'ballshit':
				this.geometry = this._getBallShitGeometry()
				break
			default:
				this.geometry = this._getShitGeometry()
		}
	}

	_getShitGeometry() {
		const base = new THREE.BoxGeometry(1.8, 0.4, 1.8)
		base.translate(0, 0.21, 0)
		const mid = new THREE.BoxGeometry(1.2, 0.4, 1.2)
		mid.translate(0, 0.61, 0)
		const top = new THREE.BoxGeometry(0.5, 0.4, 0.5)
		top.translate(0, 1.01, 0)

		return mergeBufferGeometries([base, mid, top])
	}

	_getBallShitGeometry() {
		const ball = new THREE.SphereGeometry(1.15, 7, 5)
		ball.rotateX(Math.PI * 0.5 * Math.random())
		ball.rotateY(Math.PI * 0.5 * Math.random())
		// ball.scale(1, 1, 1.4)

		const tail = new THREE.SphereGeometry(0.8, 5, 5)
		tail.rotateX(Math.PI * 0.5)
		tail.translate(0, 0, -1)

		return mergeBufferGeometries([ball])
	}
}
