<script>
	import { Canvas } from '@threlte/core';

	import Scene from './Scene.svelte';
	import { World } from '@threlte/rapier';
	import { canEdit } from './gamestate';
	import { onMount } from 'svelte';
	import Menu from './Menu.svelte';
	import { replaceState } from '$app/navigation';

	let edit = false;

	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		edit = params.has('edit');

		if (edit) {
			replaceState('', {
				gameState: 'edit'
			});
			$canEdit = true;
		}
	});
</script>

<div class="fixed w-screen h-screen -z-10">
	<Canvas>
		<World>
			<Scene />
		</World>
	</Canvas>
</div>

<Menu />
