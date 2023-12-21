import type { EulerOrder } from 'three';

export type GameState =
	| 'menu'
	| 'levels'
	| 'customLevels'
	| 'playing'
	| 'paused'
	| 'won'
	| 'edit'
	| 'editHelp'
	| 'gameHelp'
	| 'settings';

export type Platform = {
	position: [number, number, number];
	scale: [number, number, number];
	rotation: [number, number, number] | [number, number, number, EulerOrder];
	type?: 'normal' | 'win';
};

export type Level = {
	name: string;
	platforms: Platform[];
	image?: string;
};
