import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import gsap from 'gsap'

import * as SOUNDS from './audio'
import { BufferAttribute } from 'three'

const event = new Event('gameover')

export default class BasicScene {
	isStarted = false

	score
	bestScore

	scene
	world

	wind = new CANNON.Vec3(0, 0, -0.0002)
	gravity = new THREE.Vector3(0, -2 / 240, 0)

	camera
	controls
	renderer

	offset = 0

	jump = false

	lights = []
	meshes = []
	bodies = []

	clock
	fr = 1 / 60

	player
	gameover = false

	constructor({ camera = {}, enableShadow = false, world = { forces: [] } }) {
		this.clock = new THREE.Clock()

		this.scene = new THREE.Scene()
		this.scene.background = new THREE.Color('#111111')
		// this.scene.add(new THREE.AxesHelper(5))
		this.score = document.getElementById('score')

		this.initRenderer()
		this.initDefaultLight()
		this.initCamera(camera)
		this.initWorld(world.forces)
		this.animate()
		this.initControls()
	}

	initRenderer(enableShadow) {
		this.renderer = new THREE.WebGLRenderer()
		this.renderer.setSize(window.innerWidth, window.innerHeight)
		this.renderer.setPixelRatio(window.devicePixelRatio)
		this.renderer.shadowMap.enabled = enableShadow
		document.body.appendChild(this.renderer.domElement)

		window.addEventListener('resize', () => {
			this.onWindowResize()
		})
	}

	initControls() {
		this.controls = new OrbitControls(this.camera, this.renderer.domElement)
		this.controls.enableRotate = false
		this.controls.enableZoom = false
		this.controls.enablePan = false
		this.controls.enableDamping = true
		this.controls.target = new THREE.Vector3(0, 0, 0)
	}

	initCamera({ type = 'perspective', near = 0, far = 2000, fov }) {
		if (type === 'orto') {
			this.camera = new THREE.OrthographicCamera(
				window.innerWidth / -48,
				window.innerWidth / 48,
				window.innerHeight / 48,
				window.innerHeight / -48,
				near,
				far
			)
		} else {
			this.camera = new THREE.PerspectiveCamera(
				fov,
				window.innerWidth / window.innerHeight,
				near,
				far
			)
		}

		this.scene.add(this.camera)

		this.camera.position.set(50, 50, 50)

		if (window.innerWidth < 890) {
			this.camera.zoom = 0.6
			this.camera.updateProjectionMatrix()
			this.offset = 7
		}
	}

	addObject({ mesh, body }) {
		this.addBody(body)
		this.addMesh(mesh)
	}

	removeObject({ mesh, body }) {
		this.removeBody(body)
		this.removeMesh(mesh)
	}

	removeMesh(mesh) {
		const i = this.meshes.indexOf(mesh)
		if (i >= 0) {
			this.meshes.splice(i, 1)
			this.scene.remove(mesh)
		}
	}

	removeBody(body) {
		const i = this.bodies.indexOf(body)
		if (i >= 0) {
			this.bodies.splice(i, 1)
			setTimeout(() => {
				this.world.removeBody(body)
			}, 50)
		}
	}

	addMesh(mesh) {
		this.meshes.push(mesh)
		this.scene.add(mesh)
	}

	addBody(body) {
		this.bodies.push(body)
		this.world.addBody(body)
	}

	initDefaultLight() {
		const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
		const dirLight = new THREE.DirectionalLight('#ffffff', 0.8)
		dirLight.position.copy(new THREE.Vector3(10, 15, 0))
		// dirLight.target = new THREE.Vector3(0,0,0)

		this.lights.push(ambientLight)
		this.lights.push(dirLight)

		this.scene.add(ambientLight)
		this.scene.add(dirLight)
	}

	initWorld(forces) {
		let force = new CANNON.Vec3()
		for (let f of forces) {
			force = force.vadd(f)
		}

		// console.log(force);
		// todo: sum all the forces and apply to world
		this.world = new CANNON.World({
			gravity: force,
			allowSleep: true,
		})
	}

	onWindowResize() {
		// console.log('resize')
		if (this.camera instanceof THREE.PerspectiveCamera) {
			this.camera.aspect = window.innerWidth / window.innerHeight
		} else if (this.camera instanceof THREE.OrthographicCamera) {
			this.camera.left = window.innerWidth / -48
			this.camera.right = window.innerWidth / 48
			this.camera.top = window.innerHeight / 48
			this.camera.bottom = window.innerHeight / -48
		}
		this.camera.updateProjectionMatrix()
		this.renderer.setSize(window.innerWidth, window.innerHeight)
		this.render()
	}

	reset() {
		SOUNDS._GAME_OVER.play()

		let player = this.player.body //bodies[0]
		player.position.copy(new CANNON.Vec3(0, 10, 0))
		player.velocity = new CANNON.Vec3(0, 0, 0)

		this.world.gravity = new CANNON.Vec3(0, -100, 0)
		this.isStarted = false
		this.jump = false

		window.dispatchEvent(event)
	}

	animate() {
		requestAnimationFrame(() => {
			this.animate()
		})

		// this.controls && this.controls.update()
		let player = this.player?.body //this.bodies[0]

		if (player) {
			//limit y positive velocity
			player.velocity.y = player.velocity.y < 40 ? player.velocity.y : 40

			if (this.isStarted) player.applyImpulse(this.wind)

			if (player.position.y < -20) this.gameover = true
		}

		if (this.gameover) {
			this.gameover = false
			this.reset()
		}

		this.world.gravity.vadd(this.wind)

		let delta = Math.min(this.clock.getDelta(), 0.1)

		this.world.step(delta)

		if (this.player?.sparks) {
			const positions = this.player.sparks.geometry.getAttribute('position')
			const velocities = this.player.sparks.geometry.getAttribute('velocity')
			const colors = this.player.sparks.geometry.getAttribute('color')
			// console.log(positions)

			if (player.velocity.z != 0) {
				const pos = new Float32Array(this.player.sparks.count * 3)

				const randomSparkIndex = Math.floor(Math.random() * positions.count)
				const py = positions.getY(randomSparkIndex)

				if (py <= 2 && player.position.y < 2.5 && player.position.y > 1.95) {
					// console.log(body.position);
					const px = Math.random() < 0.5 ? 1 : -1
					const pz = Math.random() < 0.5 ? Math.random() : -Math.random()
					// console.log([px,0,body.position.z])
					const vx = Math.sign(px) * Math.random()
					positions.set([px, 0, player.position.z + pz], randomSparkIndex * 3)
					velocities.set([vx / 3, 16 / 90, 12 / 60], randomSparkIndex * 3)
					colors.setW(randomSparkIndex, 1)
				}

				for (let i = 0; i < positions.count; i++) {
					const p = new THREE.Vector3(
						positions.getX(i),
						positions.getY(i),
						positions.getZ(i)
					)
					const v = new THREE.Vector3(
						velocities.getX(i),
						velocities.getY(i),
						velocities.getZ(i)
					)
					v.add(this.gravity)

					// console.log(v)
					const newPos = p.add(v)

					velocities.set(v.toArray(), i * 3)
					pos.set(newPos.toArray(), i * 3)
					colors.setW(i, colors.getW(i) * 0.95)
				}
				this.player.sparks.geometry.setAttribute(
					'position',
					new BufferAttribute(pos, 3)
				)
				positions.needsUpdate = true
				velocities.needsUpdate = true
				colors.needsUpdate = true
				// this.player.sparks.geometry.needsUpdate = true
			}
		}

		// console.log(this.bodies)

		for (let i = 0; i < this.bodies.length; i++) {
			// console.log(this.meshes[i]);

			// if (this.bodies[i].mass === 0) {
			// 	this.bodies[i].position.z += 0.1
			// }

			this.meshes[i].position.copy(this.bodies[i].position)

			this.meshes[i].quaternion.copy(this.bodies[i].quaternion)
		}

		if (player) {
			this.camera.position.z = THREE.MathUtils.lerp(
				player.position.z + this.camera.position.y - this.offset,
				this.camera.position.z,
				0.9
			)
			this.controls.target.z = this.camera.position.z - this.camera.position.y
			this.score.innerHTML = parseInt(-player.position.z * 2)
		}

		// console.log(bullets)

		this.render()
	}

	render() {
		this.renderer.render(this.scene, this.camera)
	}
}
