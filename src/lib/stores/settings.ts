import { localStorageStore } from '$lib/helper/LocalStorageStore/LocalStorageStore';
import type { Writable } from 'svelte/store';

export const showDebug = localStorageStore('debug', false);

export const showShadows: Writable<boolean> = localStorageStore('shadows', true);
