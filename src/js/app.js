import '../scss/app.scss';
import * as THREE from 'three'
import * as CANNON from 'cannon-es'

import BasicScene from './scene'
// import Platform from './platform';
import GameManager from './game';

if (process.env.NODE_ENV === 'development') {
    require('../index.html');
  }

console.log('hello world');

let _APP
let _GAME

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


});





