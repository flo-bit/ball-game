import type { EulerOrder } from 'three';

export type GameState = 'menu' | 'levels' | 'playing' | 'paused' | 'won' | 'help' | 'settings';

export type PlatformType = 'start' | 'normal' | 'win' | 'force' | 'bounce' | 'slide';

export type Platform = {
	position: [number, number, number];
	scale: [number, number, number];
	rotation: [number, number, number] | [number, number, number, EulerOrder];
	type?: PlatformType;
};

export type Level = {
	name: string;
	platforms: Platform[];
	image?: string;
};
