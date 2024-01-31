import { localStorageStore } from '$lib/helper/LocalStorageStore/LocalStorageStore';
import type { Platform } from '$lib/types';
import { writable, type Writable } from 'svelte/store';

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

export const editMode: Writable<'translate' | 'rotate' | 'scale'> = writable('translate');
export const canEdit: Writable<boolean> = writable(false);
export const selectedPlatform: Writable<number> = writable(-1);
export const editSpace: Writable<'world' | 'local'> = writable('world');

export const platforms: Writable<Platform[]> = localStorageStore('platforms', startPlatforms);
export const platformsHistory: Writable<Platform[][]> = localStorageStore('history', [
	startPlatforms
]);

export const showSaveLevelDialog: Writable<boolean> = writable(false);
