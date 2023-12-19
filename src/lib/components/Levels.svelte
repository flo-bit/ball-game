<script lang="ts">
	import LevelCard from './LevelCard.svelte';
	import type { Level } from '../types';
	import { pushState, replaceState } from '$app/navigation';
	import { canEdit, currentLevel, customHighscores, highscores, playLevel, playing, playingTime } from '../../routes/gamestate';

	export let levels: Level[] = [];

	export let customLevels = false;
</script>

<div class="grid grid-cols-2 gap-x-4 gap-y-5 sm:gap-x-6 sm:grid-cols-3 lg:gap-x-8">
	{#if customLevels}
		<LevelCard
			level={{ name: 'new level', platforms: [] }}
			onClick={() => {
				$canEdit = true;
				pushState('', {
					gameState: 'edit'
				});
			}}
			showHighscore={false}
		/>
	{/if}

	{#each levels as level, index}
		<LevelCard
			{level}
			highscore={customLevels ? $customHighscores[index] : $highscores[index]}
			onClick={() => {
				$canEdit = false;
				playLevel(index, customLevels);
			}}
		/>
	{/each}
</div>
