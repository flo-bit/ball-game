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

export const customHighscores: Writable<number[]> = localStorageStore('customHighscores', []);

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
		type: 'win'
	}
];

export const platforms: Writable<Platform[]> = localStorageStore('platforms', startPlatforms);
export const platformsHistory: Writable<Platform[][]> = localStorageStore('history', [
	startPlatforms
]);

export const currentLevel: Writable<number> = localStorageStore('level', 0);

export const customLevels: Writable<Level[]> = localStorageStore('customLevels', []);

export const levels: Level[] = [
	{
		image: '/images/beginning.png',
		name: 'beginning',
		platforms: [
			{
				scale: [4, 0.5, 11.39683540432216],
				position: [0, 0, -7.164888403988531],
				rotation: [0, 0, 0, 'XYZ']
			},
			{
				scale: [4, 0.5, 4],
				position: [14.710153919714521, 0, -30.60983074984392],
				rotation: [0, 0, 0, 'XYZ'],
				type: 'win'
			},
			{
				scale: [4, 0.5, 11.39683540432216],
				position: [7.2380011644867, 0, -22.53609739469713],
				rotation: [3.141592653589793, -1.5583317625112427, 3.141592653589793, 'XYZ']
			}
		]
	},
	{
		image: '/images/jumps.png',
		name: 'jumps',
		platforms: [
			{ scale: [4, 0.5, 4], position: [0, 0, -40], rotation: [0, 0, 0, 'XYZ'], type: 'win' },
			{ position: [0, 0, 0], scale: [4, 0.5, 4], rotation: [0, 0, 0, 'XYZ'] },
			{ position: [0, 0, -13.031173638120949], scale: [4, 0.5, 4], rotation: [0, 0, 0, 'XYZ'] },
			{ position: [0, 0, -25.96303713055015], scale: [4, 0.5, 4], rotation: [0, 0, 0, 'XYZ'] }
		]
	},
	{
		image: '/images/more_jumps.png',
		name: 'more jumps',
		platforms: [
			{
				scale: [4, 0.5, 4],
				position: [0, 0, -40],
				rotation: [0, 0, 0.29790196078633, 'XYZ'],
				type: 'win'
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
		image: '/images/balance.png',
		name: 'balance',
		platforms: [
			{ scale: [4, 0.5, 4], position: [0, 0, 0], rotation: [0, 0, 0, 'XYZ'] },
			{ scale: [4, 0.5, 4], position: [0, 0, -40], rotation: [0, 0, 0, 'XYZ'], type: 'win' },
			{
				scale: [0.3273853771319995, 0.5, 14.882666399413333],
				position: [0, -0.1985622847682409, -20.149337227863658],
				rotation: [0, 0, 0, 'XYZ']
			}
		]
	},
	{
		image: '/images/up_and_down.png',
		name: 'up and down',
		platforms: [
			{ scale: [4, 0.5, 4], position: [0, 0, 0], rotation: [0, 0, 0, 'XYZ'] },
			{ scale: [4, 0.5, 4], position: [0, 0, -40], rotation: [0, 0, 0], type: 'win' },
			{
				scale: [4, 0.5, 4],
				position: [0, 1.5129388147544773, -7.321495921119439],
				rotation: [0.420885338288005, 0, 0, 'XYZ']
			},
			{
				scale: [4, 0.5, 4],
				position: [0, 1.5129388147544773, -21.487362129957358],
				rotation: [0.420885338288005, 0, 0, 'XYZ']
			},
			{
				scale: [4, 0.5, 4],
				position: [0, 1.5129388147544773, -14.345030844794827],
				rotation: [-0.3895030344166943, 0, 0, 'XYZ']
			},
			{
				scale: [4, 0.5, 4],
				position: [0, 1.5129388147544773, -32.250478838897635],
				rotation: [-0.3895030344166943, 0, 0, 'XYZ']
			}
		]
	},
	{
		image: '/images/stairs.png',
		name: 'stairs',
		platforms: [
			{
				scale: [4, 0.5, 4],
				position: [0, 10.422115086009022, -0.1478780521643741],
				rotation: [0, 0, 0, 'XYZ'],
				type: 'win'
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
		name: 'unstable',
		platforms: [
			{
				scale: [4, 0.5, 4],
				position: [0, 0, -38.5106006212193],
				rotation: [0, 0, 0, 'XYZ'],
				type: 'win'
			},
			{ position: [0, 0, 0], scale: [4, 0.5, 4], rotation: [0, 0, 0, 'XYZ'] },
			{
				position: [0, -1.407325156453589, -9.752171784304942],
				scale: [1.3756253797770193, 0.5, 4],
				rotation: [0, 0, -1.377718749299762, 'XYZ']
			},
			{
				position: [0, -1.407325156453589, -19.347765167785376],
				scale: [1.3756253797770193, 0.5, 4],
				rotation: [0, 0, -1.6259660684128463, 'XYZ']
			},
			{
				position: [0, -1.407325156453589, -28.5936794532523],
				scale: [1.3756253797770193, 0.5, 4],
				rotation: [0, 0, -1.4269680352972387, 'XYZ']
			}
		]
	},
	{
		name: 'test',
		platforms: [
			{ scale: [4, 0.5, 4], position: [0, 0, 0], rotation: [0, 0, 0, 'XYZ'] },
			{ scale: [4, 0.5, 4], position: [0, 0, -40], rotation: [0, 0, 0], type: 'win' },
			{
				scale: [2.251843724978521, 0.5, 9.272233890947485],
				position: [0, -6.275587982327923, -10.266899000296856],
				rotation: [-0.7515008406840861, 0, 0, 'XYZ']
			},
			{
				scale: [2.251843724978521, 0.5, 13.662286491614198],
				position: [0, -6.275587982327923, -24.16930203902464],
				rotation: [0.48273048235999805, 0, 0, 'XYZ']
			}
		]
	},
	{
		name: 'holes',
		platforms: [
			{ scale: [4, 0.5, 4], position: [0, 0, 0], rotation: [0, 0, 0, 'XYZ'] },
			{ scale: [4, 0.5, 4], position: [0, 0, -40], rotation: [0, 0, 0, 'XYZ'], type: 'win' },
			{
				scale: [2.7479775572042366, 0.5, 1.6495470951258044],
				position: [-1.249664585534397, 0, -5.349223789150164],
				rotation: [0, 0, 0, 'XYZ']
			},
			{
				scale: [2.7479775572042366, 0.5, 1.6495470951258044],
				position: [1.3316018520296717, 0, -8.385409027880756],
				rotation: [0, 0, 0, 'XYZ']
			},
			{
				scale: [2.7479775572042366, 0.5, 1.6495470951258044],
				position: [-1.1969275198568154, 0, -11.345880530273982],
				rotation: [0, 0, 0, 'XYZ']
			},
			{
				scale: [1.363850307007166, 0.5, 1.6495470951258044],
				position: [-2.561066253282764, 0, -14.469992237728778],
				rotation: [0, 0, 0, 'XYZ']
			},
			{
				scale: [1.363850307007166, 0.5, 1.6495470951258044],
				position: [0.1629179177725213, 0, -17.62326157863934],
				rotation: [0, 0, 0, 'XYZ']
			},
			{
				scale: [2.7479775572042366, 0.5, 1.6495470951258044],
				position: [-1.1969275198568154, 0, -20.690501596822926],
				rotation: [0, 0, 0, 'XYZ']
			},
			{
				scale: [1.363850307007166, 0.5, 1.6495470951258044],
				position: [2.7361780177746766, 0, -23.77969661528989],
				rotation: [0, 0, 0, 'XYZ']
			},
			{
				scale: [2.7479775572042366, 0.5, 1.6495470951258044],
				position: [-1.1969275198568154, 0, -26.826454342829738],
				rotation: [0, 0, 0, 'XYZ']
			},
			{
				scale: [2.7479775572042366, 0.5, 1.6495470951258044],
				position: [1.3316018520296717, 0, -29.97524573150933],
				rotation: [0, 0, 0, 'XYZ']
			},
			{
				scale: [1.363850307007166, 0.5, 0.828345270969725],
				position: [2.7361780177746766, 0, -32.15629581514443],
				rotation: [0, 0, 0, 'XYZ']
			},
			{ scale: [4, 0.5, 4], position: [0, 0, -40], rotation: [0, 0, 0, 'XYZ'], type: 'win' }
		]
	}
];

export const playingCustomLevel: Writable<boolean> = writable(false);

export const showNewHighscore: Writable<boolean> = writable(false);

export const playLevel = (level: number, custom: boolean | undefined = undefined) => {
	if (custom != undefined) playingCustomLevel.set(custom);
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

export const playerPosition: Writable<[number, number, number]> = writable([0, 0, 0]);

export const showShadows: Writable<boolean> = localStorageStore('shadows', true);
