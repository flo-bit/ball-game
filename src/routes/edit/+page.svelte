<script>
	import { Canvas } from '@threlte/core';
	import { World } from '@threlte/rapier';

	import Scene from '$lib/edit/Scene.svelte';
	import EditControls from '$lib/ui/views/EditControls.svelte';
</script>


<div class="fixed w-screen h-screen -z-10 overflow-hidden">
	<Canvas>
		<World>
			<Scene />
		</World>
	</Canvas>
</div>

<EditControls />
