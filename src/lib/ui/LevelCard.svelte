<script lang="ts">
	import type { Level } from '$lib/types';
	import { Canvas } from '@threlte/core';
	import { highscores, platforms } from '../../routes/gamestate';
	import PreviewScene from '../../routes/PreviewScene.svelte';

	export let onClick: () => void;

	export let level: Level | undefined = undefined;

	export let highscore: number | undefined = undefined;

	export let showHighscore = true;
</script>

<div class="group relative">
	<div
		class="h-24 md:h-32 lg:h-44 w-full overflow-hidden rounded-md bg-gray-200/50 group-hover:opacity-90 ring-1 ring-black/5 group-hover:ring-black/20 group-hover:ring-2 transition-all ease-in-out duration-200"
	>
		<div class="h-full w-full">
			{#if level?.platforms}
				<Canvas>
					<PreviewScene platforms={level.platforms} />
				</Canvas>
			{/if}
		</div>
	</div>
	<h3 class="mt-4 text-sm text-gray-900">
		<button on:click={onClick}>
			<span class="absolute inset-0"></span>
			{level?.name ?? 'New Level'}
		</button>
	</h3>
	{#if showHighscore}
		{#if highscore}
			<p class="mt-1 text-xs text-gray-700">Highscore: {highscore.toFixed(2)} s</p>
		{:else}
			<p class="mt-1 text-xs text-gray-700">No highscore</p>
		{/if}
	{/if}
</div>
