import {Howl, Howler} from 'howler';

export const _JUMP = new Howl({
    src: ['./src/sounds/waterdrop.wav'],
    preload: true,
    volume: 0.8
});

export const _GAME_OVER = new Howl({
    src: ['./src/sounds/game-over.wav'],
    preload: true,
    volume: 0.8
});

export const _SOUNDTRACK = new Howl({
    src: ['./src/sounds/cave.wav'],
    preload: true,
    loop: true,
    volume: 0.4
});