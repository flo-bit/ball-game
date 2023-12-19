<script>
	import { Canvas } from '@threlte/core';
	import { World } from '@threlte/rapier';

	import Scene from './Scene.svelte';
	import Menu from './Menu.svelte';
</script>

<div class="fixed w-screen h-screen -z-10">
	<Canvas>
		<World>
			<Scene />
		</World>
	</Canvas>
</div>

<Menu />
