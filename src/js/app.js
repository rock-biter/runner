import '../scss/app.scss';
import * as THREE from 'three'
import * as CANNON from 'cannon-es'

import BasicScene from './scene'
// import Platform from './platform';
import GameManager from './game';
import gsap from 'gsap';

if (process.env.NODE_ENV === 'development') {
    require('../index.html');
  }

console.log('hello world');

let _APP
let _GAME


const appH = () => {
	const doc = document.documentElement
	doc.style.setProperty('--app-height',`${window.innerHeight}px`)
}

window.addEventListener('DOMContentLoaded', () => {
  let world = {
    forces: []
  }

  let g = new CANNON.Vec3(0,-100,0);
  world.forces.push(g);

  // let wind = new CANNON.Vec3(0,0,-5)
  // world.forces.push(wind);

  let config = {}

  _APP = new BasicScene({
    camera: { type: 'orto'}, 
    enableShadow: true, 
    world
  });

  _GAME = new GameManager({
    _APP: _APP, 
    config
  });

  document.querySelectorAll('.fade-in').forEach(el => {
    gsap.fromTo(el,{autoAlpha: 0, y: 100},{autoAlpha: 1, y: 0, duration: 1.5, ease: 'expo3.inOut' })
  })


  appH()
});





