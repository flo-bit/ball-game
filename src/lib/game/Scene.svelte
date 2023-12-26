<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { OrbitControls } from '@threlte/extras';
	import { Sky } from '@threlte/extras';
	import { Debug } from '@threlte/rapier';

	import Stats from 'stats.js';
	import { page } from '$app/stores';
	import { DirectionalLight, Object3D } from 'three';

	import Player from './Player.svelte';
	import Level from './Level.svelte';

	import {
		currentLevel,
		playerPosition,
		showDebug,
		showShadows,
		platforms,
		selectedPlatform
	} from '../gamestate';

	let stats: Stats | undefined;

	$: if ($showDebug && document && !stats) {
		stats = new Stats();
		document.body.appendChild(stats.dom);
	}
	$: if (!$showDebug && stats) {
		stats.dom.remove();
		stats = undefined;
	}

	useTask(() => {
		if (stats) stats.update();
	});

	let dirLight: DirectionalLight;

	let target: Object3D;

	let orbitControls: OrbitControls;

	$: orbitTarget =
		$selectedPlatform >= 0 && $selectedPlatform < $platforms.length
			? $platforms[$selectedPlatform].position
			: [0, 0, 0];
</script>

<svelte:window
	on:mouseup={() => {
		if (orbitControls) {
			orbitControls.update();
		}
	}}
/>

{#if $showDebug}
	<Debug />
{/if}

{#if $page.state.gameState !== 'edit'}
	{#if $currentLevel >= 0}
		<Player />
	{/if}
{:else}
	<!-- indicator for player spawn -->
	<T.Mesh position={[0, 5, 0]} castShadow>
		<T.SphereGeometry args={[0.5, 32, 32]} />
		<T.MeshStandardMaterial color="red" />
	</T.Mesh>

	<T.Object3D position={[0, -10, 0]}>
		<T.GridHelper args={[300, 20, 'red', 'red']} />
	</T.Object3D>

	<T.PerspectiveCamera makeDefault fov={75} near={0.1} far={1000}>
		<OrbitControls bind:ref={orbitControls} target={orbitTarget}></OrbitControls>
	</T.PerspectiveCamera>
{/if}

<Sky elevation={4} />

<Level />

<T.Object3D bind:ref={target} position={$playerPosition}></T.Object3D>

{#if target && $showShadows}
	<T.DirectionalLight
		ref={dirLight}
		{target}
		position={[$playerPosition[0], $playerPosition[0] + 100, $playerPosition[2] - 100]}
		intensity={1.0}
		castShadow
		shadow.mapSize.width={1024 * 4}
		shadow.mapSize.height={1024 * 4}
		shadow.camera.left={-20}
		shadow.camera.right={20}
		shadow.camera.top={20}
		shadow.camera.bottom={-20}
	/>
{:else}
	<T.DirectionalLight ref={dirLight} position={[0, 10, -10]} intensity={1.0} />
{/if}
