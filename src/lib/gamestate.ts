import { localStorageStore } from '$lib/helper/LocalStorageStore/LocalStorageStore';
import { writable, type Writable } from 'svelte/store';
import type { Platform, Level } from '$lib/types';
import { pushState, replaceState } from '$app/navigation';

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
		name: 'beginning',
		platforms: [
			{
				scale: [4, 0.5, 11.39683540432216],
				position: [0, 0, -7.164888403988531],
				rotation: [0, 0, 0, 'XYZ'],
				type: 'start'
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
		name: 'jumps',
		platforms: [
			{ scale: [4, 0.5, 4], position: [0, 0, -40], rotation: [0, 0, 0, 'XYZ'], type: 'win' },
			{ position: [0, 0, 0], scale: [4, 0.5, 4], rotation: [0, 0, 0, 'XYZ'], type: 'start' },
			{
				position: [0, 0, -13.031173638120949],
				scale: [4, 0.5, 4],
				rotation: [0, 0, 0, 'XYZ']
			},
			{
				position: [0, 0, -25.96303713055015],
				scale: [4, 0.5, 4],
				rotation: [0, 0, 0, 'XYZ']
			}
		]
	},
	{
		name: 'more jumps',
		platforms: [
			{
				scale: [4, 0.5, 4],
				position: [0, 0, -40],
				rotation: [0, 0, 0.29790196078633, 'XYZ'],
				type: 'win'
			},
			{ position: [0, 0, 0], scale: [4, 0.5, 4], rotation: [0, 0, 0, 'XYZ'], type: 'start' },
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
		name: 'force',
		platforms: [
			{
				scale: [4, 0.5, 29.8969936838748],
				position: [0, 0, -24.56130796901325],
				rotation: [0, 0, 0, 'XYZ']
			},
			{
				scale: [4, 0.5, 4],
				position: [0, 0, -58.40373152986804],
				rotation: [0, 0, 0, 'XYZ'],
				type: 'win'
			},
			{
				position: [4.784362907918382, 3.7517014142182568, -13.475502227619513],
				scale: [4, 0.5, 4],
				rotation: [0, 0, 1.5707963267948963, 'XYZ'],
				type: 'force'
			},
			{
				position: [4.784362907918382, 3.7517014142182568, -37.065705841004814],
				scale: [4, 0.5, 4],
				rotation: [0, 0, 1.5707963267948963, 'XYZ'],
				type: 'force'
			},
			{
				position: [-4.901869282676323, 3.7517014142182568, -26.251062381288293],
				scale: [4, 0.5, 4],
				rotation: [-3.141592653589793, 1.2246467991473532e-16, -1.570796326794897, 'XYZ'],
				type: 'force'
			}
		]
	},
	{
		name: 'bounce',
		platforms: [
			{ scale: [4, 0.5, 4], position: [0, 0, 0], rotation: [0, 0, 0, 'XYZ'] },
			{
				position: [0, -10.246678261241073, -17.125281484447395],
				scale: [4, 0.5, 4],
				rotation: [0, 0, 0, 'XYZ'],
				type: 'bounce'
			},
			{
				position: [0, 0, -29.570276428686107],
				scale: [4, 0.5, 4],
				rotation: [0, 0, 0, 'XYZ'],
				type: 'win'
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
		name: 'climb',
		platforms: [
			{ scale: [4, 0.5, 4], position: [0, 0, 0], rotation: [0, 0, 0, 'XYZ'] },
			{ scale: [4, 0.5, 4], position: [0, 0, -43], rotation: [0, 0, 0, 'XYZ'], type: 'win' },
			{ position: [0, 3, -11], scale: [4, 0.5, 4], rotation: [1.5707963267948963, 0, 0, 'XYZ'] },
			{ scale: [4, 0.5, 4], position: [0, 0, -15], rotation: [0, 0, 0, 'XYZ'] },
			{ position: [0, 3, -26], scale: [4, 0.5, 4], rotation: [1.5707963267948963, 0, 0, 'XYZ'] },
			{ scale: [4, 0.5, 4], position: [0, 0, -30], rotation: [0, 0, 0, 'XYZ'] }
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
	},
	{
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
		name: 'advanced',
		platforms: [
			{ scale: [4, 0.5, 4], position: [0, 0, 0], rotation: [0, 0, 0, 'XYZ'] },
			{
				scale: [4, 0.5, 4],
				position: [-21.36346620952584, 21.827031747069448, 45.03575790750377],
				rotation: [0, 0, 0, 'XYZ'],
				type: 'win'
			},
			{
				scale: [4, 0.5, 4],
				position: [0, 1.6840679745484683, -6.867029667052471],
				rotation: [0.48555986495581427, 0, 0, 'XYZ']
			},
			{
				scale: [4, 0.5, 11.84604207129967],
				position: [0, 3.380764527297683, -22.079243389897968],
				rotation: [0, 0, 0, 'XYZ']
			},
			{
				scale: [1.2287432564883323, 0.5, 1.3535196984562008],
				position: [1.8508653819584393, 4.915756264177223, -36.23147911724974],
				rotation: [0, 0, 0, 'XYZ']
			},
			{
				scale: [1.2287432564883323, 0.5, 1.3535196984562008],
				position: [-0.20658606414795688, 6.008764203889945, -39.18105938853369],
				rotation: [0, 0, 0, 'XYZ']
			},
			{
				scale: [1.2287432564883323, 0.5, 1.3535196984562008],
				position: [-2.024906797506631, 7.241275713181211, -41.379975061464094],
				rotation: [0, 0, 0, 'XYZ']
			},
			{
				scale: [1.2287432564883323, 0.5, 1.3535196984562008],
				position: [-5.078920253863724, 8.468138435988536, -41.379975061464094],
				rotation: [0, 0, 0, 'XYZ']
			},
			{
				scale: [1.2287432564883323, 0.5, 1.3535196984562008],
				position: [-9.19808534727111, 8.468138435988536, -42.0668243367807],
				rotation: [0, 0, 0, 'XYZ']
			},
			{
				scale: [1.2287432564883323, 0.5, 1.3535196984562008],
				position: [-14.052581317386943, 8.468138435988536, -41.379975061464094],
				rotation: [0, 0, 0, 'XYZ']
			},
			{
				scale: [1.2287432564883323, 0.5, 1.3535196984562008],
				position: [-19.039288148847895, 7.664427227581998, -41.379975061464094],
				rotation: [0, 0, 0, 'XYZ']
			},
			{
				scale: [4, 0.5, 18.83117495929792],
				position: [-19.43192365832157, 9.432743634617532, -15.086072785588204],
				rotation: [0, 0, 0, 'XYZ']
			},
			{
				scale: [1.2287432564883323, 0.5, 2.3891806989027247],
				position: [-19.039288148847895, 8.847730139121492, -37.555199863653336],
				rotation: [-0.3952144656463501, 0, 0, 'XYZ']
			},
			{
				position: [-13.851566839501439, 11.498987375819377, -24.97545472934522],
				scale: [4, 0.5, 4],
				rotation: [0, 0, 1.5707963267948963, 'XYZ'],
				type: 'force'
			},
			{
				position: [-13.851566839501439, 11.498987375819377, -4.844612856923043],
				scale: [4, 0.5, 4],
				rotation: [0, 0, 1.5707963267948963, 'XYZ'],
				type: 'force'
			},
			{
				position: [-25.015817203790828, 11.498987375819377, -15.862469874759299],
				scale: [4, 0.5, 4],
				rotation: [0, 0, -1.570796326794897, 'XYZ'],
				type: 'force'
			},
			{
				position: [-19.440744829605922, 10.399897119144079, 8.290410701942108],
				scale: [1.6005738945105008, 0.5, 4],
				rotation: [0, 0, 0, 'XYZ'],
				type: 'normal'
			},
			{
				position: [-22.085895870594687, 10.399897119144079, 16.785878935245265],
				scale: [1.6005738945105008, 0.5, 4],
				rotation: [0, 0, 0, 'XYZ'],
				type: 'normal'
			},
			{
				position: [-18.923112753694113, 10.399897119144079, 25.003967018679358],
				scale: [1.6005738945105008, 0.5, 4],
				rotation: [0, 0, 0, 'XYZ'],
				type: 'normal'
			},
			{
				position: [-21.29491041260421, 7.078764122125499, 34.035889763467495],
				scale: [4, 0.5, 4],
				rotation: [0, 0, 0, 'XYZ'],
				type: 'force'
			}
		]
	}
];

export const playingCustomLevel: Writable<boolean> = writable(false);

export const showNewHighscore: Writable<boolean> = writable(false);

export const playLevel = (
	level: number,
	shouldReplaceState: boolean = false,
	custom: boolean | undefined = undefined
) => {
	if (custom != undefined) playingCustomLevel.set(custom);
	currentLevel.set(-1);
	playing.set(true);
	playingTime.set(-2.99);

	setTimeout(() => {
		currentLevel.set(level);
	}, 100);

	if (shouldReplaceState) {
		replaceState('', {
			gameState: 'playing'
		});
	} else {
		pushState('', {
			gameState: 'playing'
		});
	}
};

export const playerPosition: Writable<[number, number, number]> = writable([0, 0, 0]);

export const showShadows: Writable<boolean> = localStorageStore('shadows', true);

export const showSaveLevelDialog: Writable<boolean> = writable(false);
