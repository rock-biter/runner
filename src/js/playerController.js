import * as THREE from 'three'
import * as CANNON from 'cannon-es'

import * as SOUNDS from './audio'

export default class PlayerController {

    _P
    _B
    _M
    

    // isJumping = false

    constructor(player) {

        this._P = player
        this._B = player.body
        this._M = player.mesh

        window.addEventListener('keydown', () => {
        
            this._jump();
            
        })

    }

    _jump() {

        if(this._B.position.y < 3.0 && this._B.position.y >= 1.0 ) {
            this._B.applyImpulse(new CANNON.Vec3(0,12,0))
            SOUNDS._JUMP.play()
            // this.isJumping = true
        }

    }

}