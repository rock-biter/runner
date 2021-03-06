import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import gsap from 'gsap'


import Platform from './platform'
import Player from './player'
import PlayerController from './playerController'
import Ranking from './ranking'
import * as SOUNDS from './audio'
import { incrementDistanceCounter, incrementPlayCounter } from './usage'

export default class GameManager {

    _W
    _S

    x = -1

    score = 0
    record = 0

    platforms = []
    initialPlatformNumber = 10
    platformsLimit = 20
    lastPlatformVisited = null;

    isStarted = false

    player
    playerController

    ranking

    constructor({_APP, config = {}}) {

        this._APP = _APP
        this._W = _APP.world
        this._S = _APP.scene

        this._initGame(this.initialPlatformNumber)
        this._createPlayer()
        
        this.ranking = new Ranking()

        window.addEventListener('gameover', () => {
            this._resetGame()
        });
        

        window.addEventListener('click', () => {
            !this.isStarted ? this._startGame() : null 
        });

        if( localStorage.getItem('score') && localStorage.getItem('score').length > 0 ) {
            this.record = parseInt(localStorage.getItem('score'))
            document.getElementById('record').innerText = this.record
        }

    }

    _createPlayer() {
        this.player = new Player()
        this._APP.player = this.player
        this.playerController = new PlayerController(this.player)

        window.addEventListener('touchstart', () => {
            this.isStarted ? this.playerController._jump(): this._startGame();
        })

        this._APP.addObject({mesh: this.player.mesh,body: this.player.body});
        // this._S.add(this.player.mesh)
        this._S.add(this.player.sparks.mesh)
        // this._W.addBody(this.player.body)

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
        this.score = parseInt( document.getElementById('score').innerText )

        const distance = this.score
        incrementDistanceCounter(distance)

        if(this.score > this.record) {
            this.record = this.score
            localStorage.setItem('score',this.record)
            document.getElementById('record').innerText = this.score
            gsap.from('#record',{scale: 2, duration: 1, color: '#f9d744' })

            this.ranking.addNewScore(this.score)
        }

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

        gsap.killTweensOf(document.querySelectorAll('.fade-in'))
        document.querySelectorAll('.fade-in').forEach(el => {
            gsap.fromTo(el,{autoAlpha: 0, y: 100},{autoAlpha: 1, y: 0, duration: 1.5, ease: 'expo3.inOut' })
        })
    
    }

    _initGame(num) {


        for(let i = 0; i < num; i++) {
            this._addPlatform()
        }

        console.log(this.platforms)   
    
    }

    _startGame() {

        incrementPlayCounter()

        gsap.killTweensOf(document.querySelectorAll('.fade-in'))
        document.querySelectorAll('.fade-in').forEach(el => {
            gsap.fromTo(el,{autoAlpha: 1, y: 0},{autoAlpha: 0, y: 100, duration: 0.5, ease: 'expo3.inOut' })
          })

        this.isStarted = true
        this.player.body.applyImpulse(new CANNON.Vec3(0,0,-5))
        this._W.gravity = new CANNON.Vec3(0,-100,-1)

        document.getElementById('jump-button').innerText = 'Jump!'
      }
}