import * as THREE from 'three'
import * as CANNON from 'cannon-es'


import Platform from './platform'
import Player from './player'
import PlayerController from './playerController'
import * as SOUNDS from './audio'

export default class GameManager {

    _W
    _S

    x = -1

    score
    record

    platforms = []
    initialPlatformNumber = 10
    platformsLimit = 20
    lastPlatformVisited = null;

    isStarted = false

    player
    playerController

    constructor({_APP, config = {}}) {

        this._APP = _APP
        this._W = _APP.world
        this._S = _APP.scene

        this._initGame(this.initialPlatformNumber)
        this._createPlayer()

        

        window.addEventListener('gameover', () => {
            this._resetGame()
        });

        window.addEventListener('click', () => {
            !this.isStarted ? this._startGame() : null 
        });

    }

    _createPlayer() {
        this.player = new Player()
        this.playerController = new PlayerController(this.player)

        document.getElementById('jump-button').addEventListener('click', () => {
            this.isStarted ? this.playerController._jump(): null;
        })

        this._APP.addObject({mesh: this.player.mesh,body: this.player.body});
        this._S.add(this.player.mesh)
        this._W.addBody(this.player.body)

        SOUNDS._SOUNDTRACK.play()
    }

    _addPlatform() {

        let velocity
        if(this.player) {
            velocity = this.player.body.velocity
        } else {
            velocity = new CANNON.Vec3()
        }
    
        let p = new Platform(this.x,velocity);
        this.platforms.push(p)
        this._W.addBody(p.body)
        this._S.add(p.mesh)
      
        if(this.platforms.length >= this.platformsLimit) {

            this._removePlatform(this.platforms[this.platforms.length - this.platformsLimit])

        }
    
        this.x += p.gap + p.depth;
    
        p.body.addEventListener('collide', () => {
            this._collidedPlatform(p)
        })
    
        return p
    }

    _removePlatform(p) {

        this._W.removeBody(p.body)
        this._S.remove(p.mesh)

        p.mesh.geometry.dispose();
    
    }

    _collidedPlatform(platform) {
    
        if(this.lastPlatformVisited !== platform) {
    
            this.lastPlatformVisited = platform;
            let p = this._addPlatform()
        }

        let i = parseInt( Math.random() * ( Platform.COLORS.length - 1));
        console.log(Platform.COLORS[i]);
        platform.mesh.material.color = new THREE.Color(Platform.COLORS[i]);
    
    }

    _resetGame() {

        document.getElementById('jump-button').innerText = 'Start'

        this.x = -1
        
        for(let i = 0; i <= this.platforms.length; i++) {
    
          let pl = this.platforms[i]
    
          if(pl) {
            this._removePlatform(pl)
          }
        }
    
        this.platforms = []
    
        this._initGame(this.initialPlatformNumber)
        this.isStarted = false
    
    }

    _initGame(num) {


        for(let i = 0; i < num; i++) {
            this._addPlatform()
        }

        console.log(this.platforms)   
    
    }

    _startGame() {
        this.isStarted = true
        this.player.body.applyImpulse(new CANNON.Vec3(0,0,-5))
        this._W.gravity = new CANNON.Vec3(0,-100,-1)

        document.getElementById('jump-button').innerText = 'Jump!'
      }
}