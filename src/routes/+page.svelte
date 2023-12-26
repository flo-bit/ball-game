<script>
	import { Canvas } from '@threlte/core';
	import { World } from '@threlte/rapier';

	import Scene from '$lib/game/Scene.svelte';
	import Menu from '$lib/ui/views/Menu.svelte';
	import EditControls from '$lib/ui/views/EditControls.svelte';

	import * as ContextMenu from '$lib/components/ui/context-menu';
</script>


<div class="fixed w-screen h-screen -z-10">
	<Canvas>
		<World>
			<Scene />
		</World>
	</Canvas>
</div>


<Menu />

<EditControls />
