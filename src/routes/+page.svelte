<script>
	import { Canvas } from '@threlte/core';
	import { World } from '@threlte/rapier';

	import Scene from '$lib/game/Scene.svelte';
	import Menu from '$lib/ui/views/Menu.svelte';

	import { useProgress } from '@threlte/extras';
	import { tweened } from 'svelte/motion';
	import { fade } from 'svelte/transition';
	import { levels } from '$lib/levels';
	import { currentLevel, highscores } from '$lib/gamestate';
	import { onMount } from 'svelte';

	const { progress } = useProgress();
	const tweenedProgress = tweened($progress, {
		duration: 800
	});

	$: tweenedProgress.set($progress);


	onMount(() => {
		let i;
		for (i = 0; i < levels.length; i++) {
			if (i >= $highscores.length || $highscores[i] == null) {
				break;
			}
		}
		console.log(i);
		$currentLevel = Math.min(Math.max(i, 0), levels.length - 1);
	});
</script>

{#if $tweenedProgress < 1}
	<div
		transition:fade|local={{
			duration: 200
		}}
		class="fixed w-screen h-screen z-20 flex flex-col items-center justify-center bg-black/80"
	>
		<div class="text-white text-4xl font-semibold mb-4">Loading...</div>
		<div class="w-1/2 md:w-1/3 h-3 border border-white relative rounded-md overflow-hidden">
			<div class="h-full bg-white" style="width: {$tweenedProgress * 100}%" />
		</div>
	</div>
{/if}

<div class="fixed w-screen h-screen -z-10 overflow-hidden">
	<Canvas>
		<World>
			<Scene />
		</World>
	</Canvas>
</div>

{#if $tweenedProgress >= 1}
	<Menu />
{/if}