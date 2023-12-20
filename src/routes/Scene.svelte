<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core';

	import { CSM } from '@threlte/extras';
	import { OrbitControls } from '@threlte/extras';
	import { Sky } from '@threlte/extras';
	import { Debug } from '@threlte/rapier';

	import Player from './Player.svelte';
	import Platforms from './Platforms.svelte';

	import { currentLevel, playerPosition, showDebug } from './gamestate';

	import { onMount } from 'svelte';
	import CustomRenderer from './CustomRenderer.svelte';

	import Stats from 'stats.js';
	import { page } from '$app/stores';
	import { CameraHelper, DirectionalLight, Object3D, Vector3 } from 'three';

	let stats: Stats;
	onMount(() => {
		if ($showDebug) {
			stats = new Stats();
			stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
			document.body.appendChild(stats.dom);
		}
	});

	useTask(() => {
		if (stats) stats.update();
	});

	let { scene } = useThrelte();

	let dirLight: DirectionalLight;

	$: if (dirLight) {
		let shadowHelper = new CameraHelper(dirLight.shadow.camera);
		scene.add(shadowHelper);
	}

	let target : Object3D;
</script>


{#if $page.state.gameState !== 'edit'}
	{#if $currentLevel >= 0}
		<Player />
	{/if}

	<!-- <CustomRenderer /> -->
	{#if $showDebug}
		<Debug />
	{/if}
{:else}
	<Debug />

	<T.Object3D position={[0, -10, 0]}>
		<T.GridHelper args={[300, 20, 'red', 'red']} />
	</T.Object3D>
	<T.PerspectiveCamera makeDefault position={[10, 10, 10]} fov={75} near={0.1} far={1000}>
		<OrbitControls></OrbitControls>
	</T.PerspectiveCamera>
{/if}

<Sky elevation={4} />

<Platforms />

<T.Object3D bind:ref={target} position={$playerPosition}>
</T.Object3D>

{#if target}
<T.DirectionalLight
	ref={dirLight}
	target={target}
	position={[$playerPosition[0], $playerPosition[1] + 10, $playerPosition[2] - 10]}
	intensity={1.0}
	
	castShadow
	shadow.mapSize.width={1024 * 4}
	shadow.mapSize.height={1024 * 4}

	shadow.camera.left={-20}
	shadow.camera.right={20}
	shadow.camera.top={20}
	shadow.camera.bottom={-20}
/>
{/if}
