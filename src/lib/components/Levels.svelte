<script lang="ts">
	import LevelCard from './LevelCard.svelte';
	import type { Level } from '../types';
	import { pushState, replaceState } from '$app/navigation';
	import { currentLevel, playLevel, playing, playingTime } from '../../routes/gamestate';

	export let levels: Level[] = [];

	export let addNew = false;
</script>

<div class="grid grid-cols-2 gap-x-4 gap-y-5 sm:gap-x-6 sm:grid-cols-3 lg:gap-x-8">
	{#if addNew}
		<LevelCard
			level={{ name: 'new level', platforms: [] }}
			onClick={() => {
				pushState('', {
					gameState: 'edit'
				});
			}}
			isNew={true}
		/>
	{/if}

	{#each levels as level, index}
		<LevelCard
			{index}
			{level}
			onClick={() => {
				playLevel(index);
			}}
		/>
	{/each}
</div>
