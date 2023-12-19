<script lang="ts">
	import type { Level } from '$lib/types';
	import { highscores } from '../../routes/gamestate';

	export let onClick: () => void;

	export let level: Level;

	export let highscore: number | undefined = undefined;

	export let showHighscore = true;
</script>

<div class="group relative">
	<div
		class="h-24 md:h-32 lg:h-44 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-90 opacity-70 ring-1 ring-black/5 group-hover:ring-black/10 transition ease-in-out duration-150"
	>
		{#if level.image}
			<img
				src={level.image}
				alt="Hand stitched, orange leather long wallet."
				class="this is what the level looks like"
			/>
		{/if}
	</div>
	<h3 class="mt-4 text-sm text-gray-900">
		<button on:click={onClick}>
			<span class="absolute inset-0"></span>
			{level.name}
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
