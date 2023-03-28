import * as THREE from 'three'
import * as CANNON from 'cannon-es'

import * as SOUNDS from './audio'
import { incrementJumpCounter } from './usage'

export default class PlayerController {
	_P
	_B
	_M

	// isJumping = false

	constructor(player, gameManager) {
		this._P = player
		this._B = player.body
		this._M = player.mesh
		this.gameManager = gameManager

		window.addEventListener('keydown', () => {
			if (this.gameManager?.isStarted) {
				this._jump()
			}
		})
	}

	_jump() {
		if (this._B.position.y < 2.0 && this._B.position.y >= 0.0) {
			this._B.applyImpulse(new CANNON.Vec3(0, 12, 0))
			console.log(this._B.velocity)
			SOUNDS._JUMP.play()
			// this.isJumping = true
			incrementJumpCounter()
		}
	}
}
