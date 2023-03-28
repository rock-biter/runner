import { Howl, Howler } from 'howler'

export const _JUMP = new Howl({
	src: ['./public/sounds/waterdrop.wav'],
	preload: true,
	volume: 0.8,
})

export const _GAME_OVER = new Howl({
	src: ['./public/sounds/game-over.wav'],
	preload: true,
	volume: 0.8,
})

export const _SOUNDTRACK = new Howl({
	src: ['./public/sounds/cave.wav'],
	preload: true,
	loop: true,
	volume: 0.4,
})

export const _SHIT = new Howl({
	src: ['./public/sounds/slime-squelch-splat-01.wav'],
	preload: true,
	volume: 0.8,
})
