import { localStorageStore } from '$lib/helper/LocalStorageStore/LocalStorageStore';
import { writable, type Writable } from 'svelte/store';
import type { GameState } from './types';

export const gameState: Writable<GameState> = writable('menu');

export const firstTime = localStorageStore('firstTime', true);

export const playingTime: Writable<number> = writable(0);
export const currentLevel: Writable<number> = localStorageStore('level', 0);

export const highscores: Writable<number[]> = localStorageStore('highscores', []);
export const showNewHighscore: Writable<boolean> = writable(false);

export const playerPosition: Writable<[number, number, number]> = writable([0, 0, 0]);

export const joystickPosition: Writable<[number, number]> = writable([0, 0]);
export const rotateX: Writable<number> = writable(0);
export const jumpPressed: Writable<boolean> = writable(false);

export const playLevel = (level: number) => {
	currentLevel.set(-1);
	playingTime.set(-2.99);

	setTimeout(() => {
		currentLevel.set(level);
		gameState.set('playing');
	}, 100);

	joystickPosition.set([0, 0]);
};