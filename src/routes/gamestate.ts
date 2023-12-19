import { localStorageStore } from '$lib/LocalStorageStore/LocalStorageStore';
import { writable, type Writable } from 'svelte/store';
import type { Platform, Level } from '$lib/types';
import { pushState } from '$app/navigation';

export const playing: Writable<boolean> = writable(false);

export const playingTime: Writable<number> = writable(0);

export const editMode: Writable<'translate' | 'rotate' | 'scale'> = writable('translate');
export const canEdit: Writable<boolean> = writable(false);
export const selectedPlatform: Writable<number> = writable(-1);
export const editSpace: Writable<'world' | 'local'> = writable('world');

export const highscores: Writable<number[]> = localStorageStore('highscores', []);

export const showDebug = localStorageStore('debug', false);

export const firstTime = localStorageStore('firstTime', true);

export const startPlatforms: Platform[] = [
	{
		scale: [4, 0.5, 4],
		position: [0, 0, 0],
		rotation: [0, 0, 0]
	},
	{
		scale: [4, 0.5, 4],
		position: [0, 0, -40],
		rotation: [0, 0, 0],
		isWin: true
	}
];

export const platforms: Writable<Platform[]> = localStorageStore('platforms', startPlatforms);

export const currentLevel: Writable<number> = localStorageStore('level', 0);

export const customLevels: Writable<Level[]> = localStorageStore('customLevels', []);

export const levels: Level[] = [
	{
		name: 'Level 1',
		platforms: [
			{ scale: [4, 0.5, 4], position: [0, 0, -40], rotation: [0, 0, 0, 'XYZ'], isWin: true },
			{ position: [0, 0, 0], scale: [4, 0.5, 4], rotation: [0, 0, 0, 'XYZ'] },
			{ position: [0, 0, -13.031173638120949], scale: [4, 0.5, 4], rotation: [0, 0, 0, 'XYZ'] },
			{ position: [0, 0, -25.96303713055015], scale: [4, 0.5, 4], rotation: [0, 0, 0, 'XYZ'] }
		]
	},

	{
		name: 'Level 2',
		platforms: [
			{
				scale: [4, 0.5, 4],
				position: [0, 0, -40],
				rotation: [0, 0, 0.29790196078633, 'XYZ'],
				isWin: true
			},
			{ position: [0, 0, 0], scale: [4, 0.5, 4], rotation: [0, 0, 0, 'XYZ'] },
			{
				position: [0, 0, -13.031173638120949],
				scale: [4, 0.5, 4],
				rotation: [0, 0, 0.35670475824945647, 'XYZ']
			},
			{
				position: [0, 0, -25.96303713055015],
				scale: [4, 0.5, 4],
				rotation: [0, 0, -0.5896905195522663, 'XYZ']
			}
		]
	},

	{
		name: 'Level 3',
		platforms: [
			{
				scale: [4, 0.5, 4],
				position: [0, 10.422115086009022, -0.1478780521643741],
				rotation: [0, 0, 0, 'XYZ'],
				isWin: true
			},
			{
				position: [-0.003140599717756487, 0, -0.005938005282195569],
				scale: [4, 0.5, 4],
				rotation: [0, 0, 0, 'XYZ']
			},
			{
				position: [7.634700940032646, 0.8537893149137621, 0],
				scale: [1.6554797444687805, 0.5, 1.7525372476369359],
				rotation: [0, 0, 0, 'XYZ']
			},
			{
				position: [11.53110892957536, 2.2977765607256186, -2.6828030084552084],
				scale: [1.445027845085923, 0.5, 1.2551000699765333],
				rotation: [0, 0, 0, 'XYZ']
			},
			{
				position: [5.5758940578067575, 4.418310094669955, -7.889232182073712],
				scale: [1.5574277865946127, 0.5, 1.4109562166075647],
				rotation: [0, 0, 0, 'XYZ']
			},
			{
				position: [9.853842429315709, 3.4189527486755864, -5.99301175008582],
				scale: [1.5574277865946127, 0.5, 1.4109562166075647],
				rotation: [0, 0, 0, 'XYZ']
			},
			{
				position: [-1.3872745598534575, 6.505538523684395, -8.316534218495834],
				scale: [1.5574277865946127, 0.5, 1.4109562166075647],
				rotation: [0, 0, 0, 'XYZ']
			},
			{
				position: [2.0741769443033835, 5.490858848953307, -9.68666019361467],
				scale: [1.5574277865946127, 0.5, 1.4109562166075647],
				rotation: [0, 0, 0, 'XYZ']
			},
			{
				position: [-5.16397695284134, 7.419878368133981, -6.375037188103253],
				scale: [1.5574277865946127, 0.5, 1.4109562166075647],
				rotation: [0, 0, 0, 'XYZ']
			},
			{
				position: [-5.934590048449504, 8.916482750990953, -2.9848041649221044],
				scale: [1.5574277865946127, 0.5, 1.4109562166075647],
				rotation: [0, 0, 0, 'XYZ']
			},
			{
				position: [-5.934590048449504, 9.895648527130568, 0.6952600769091863],
				scale: [1.5574277865946127, 0.5, 1.4109562166075647],
				rotation: [0, 0, 0, 'XYZ']
			}
		]
	},
	{
		name: 'Level 2',
		platforms: [
			{
				scale: [4, 0.5, 4],
				position: [0, 0, -40],
				rotation: [0, 0, 0.29790196078633, 'XYZ'],
				isWin: true
			},
			{ position: [0, 0, 0], scale: [4, 0.5, 4], rotation: [0, 0, 0, 'XYZ'] },
			{
				position: [0, 0, -13.031173638120949],
				scale: [4, 0.5, 4],
				rotation: [0, 0, 0.35670475824945647, 'XYZ']
			},
			{
				position: [0, 0, -25.96303713055015],
				scale: [4, 0.5, 4],
				rotation: [0, 0, -0.5896905195522663, 'XYZ']
			}
		]
	},
	{
		name: 'Level 2',
		platforms: [
			{
				scale: [4, 0.5, 4],
				position: [0, 0, -40],
				rotation: [0, 0, 0.29790196078633, 'XYZ'],
				isWin: true
			},
			{ position: [0, 0, 0], scale: [4, 0.5, 4], rotation: [0, 0, 0, 'XYZ'] },
			{
				position: [0, 0, -13.031173638120949],
				scale: [4, 0.5, 4],
				rotation: [0, 0, 0.35670475824945647, 'XYZ']
			},
			{
				position: [0, 0, -25.96303713055015],
				scale: [4, 0.5, 4],
				rotation: [0, 0, -0.5896905195522663, 'XYZ']
			}
		]
	},
	{
		name: 'Level 2',
		platforms: [
			{
				scale: [4, 0.5, 4],
				position: [0, 0, -40],
				rotation: [0, 0, 0.29790196078633, 'XYZ'],
				isWin: true
			},
			{ position: [0, 0, 0], scale: [4, 0.5, 4], rotation: [0, 0, 0, 'XYZ'] },
			{
				position: [0, 0, -13.031173638120949],
				scale: [4, 0.5, 4],
				rotation: [0, 0, 0.35670475824945647, 'XYZ']
			},
			{
				position: [0, 0, -25.96303713055015],
				scale: [4, 0.5, 4],
				rotation: [0, 0, -0.5896905195522663, 'XYZ']
			}
		]
	}
];

export const playLevel = (level: number) => {
	currentLevel.set(-1);
	playing.set(true);
	playingTime.set(-2.99);

	setTimeout(() => {
		currentLevel.set(level);
	}, 100);

	pushState('', {
		gameState: 'playing'
	});
};
