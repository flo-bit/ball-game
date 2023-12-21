// See https://kit.svelte.dev/docs/types#app

import type { GameState } from '$lib/types';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		interface PageState {
			gameState: GameState | null;
			levelPage?: number;
		}
		// interface Platform {}
	}
}

export {};
