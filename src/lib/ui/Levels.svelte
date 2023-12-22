<script lang="ts">
	import LevelCard from './LevelCard.svelte';
	import type { Level } from '../types';
	import { pushState } from '$app/navigation';
	import {
		canEdit,
		customHighscores,
		highscores,
		playLevel,

		selectedPlatform

	} from '../../routes/gamestate';
	import SmallButton from './SmallButton.svelte';
	import { page } from '$app/stores';

	export let levels: Level[] = [];

	export let customLevels = false;

	let perPage = 6;
	$: start = ($page.state.levelPage ?? 0) * perPage;
</script>

<div class="grid grid-cols-2 gap-x-4 gap-y-5 sm:gap-x-6 sm:grid-cols-3 lg:gap-x-8">

	{#each [...levels].splice(start, start + perPage) as level, index}
		<LevelCard
			{level}
			highscore={customLevels ? $customHighscores[start + index] : $highscores[start + index]}
			onClick={() => {
				$canEdit = false;
				playLevel(start + index, false, customLevels);
			}}
		/>
	{/each}
</div>
<div class="flex justify-between mt-4">
	{#if customLevels}
		<SmallButton
			onClick={() => {
				
				$canEdit = true;
				$selectedPlatform = 0;
				pushState('', {
					gameState: 'edit'
				});
			
			}}>New Level</SmallButton
		>
	{:else}
		<div></div>
	{/if}
	<div>
		<SmallButton
			class="mr-2"
			disabled={start <= 0}
			onClick={() => {
				const newStart = Math.max(0, start - perPage);
				pushState('', {
					gameState: $page.state.gameState,
					levelPage: Math.floor(newStart / perPage)
				});
			}}>Previous</SmallButton
		>
		<SmallButton
			disabled={start + perPage >= levels.length}
			onClick={() => {
				const newStart = Math.max(levels.length - 2, start + perPage);
				pushState('', {
					gameState: $page.state.gameState,
					levelPage: Math.floor(newStart / perPage)
				});
				console.log(newStart / perPage);
			}}>Next</SmallButton
		>
	</div>
</div>
