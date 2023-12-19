<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core';

	import { CSM } from '@threlte/extras';
	import { OrbitControls } from '@threlte/extras';
	import { Sky } from '@threlte/extras';
	import { Debug } from '@threlte/rapier';

	import Player from './Player.svelte';
	import Platforms from './Platforms.svelte';

	import { currentLevel, showDebug } from './gamestate';

	import { onMount } from 'svelte';
	import CustomRenderer from './CustomRenderer.svelte';

	import Stats from 'stats.js';
	import { page } from '$app/stores';
	import { CameraHelper, DirectionalLight, Vector2 } from 'three';

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

<T.DirectionalLight
	ref={dirLight}
	position={[0, 10, -10]}
	intensity={1.0}
	castShadow
	shadow.shadowMap={[1024, 1024]}
/>
