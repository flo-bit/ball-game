<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core';

	import { CSM } from '@threlte/extras';
	import { OrbitControls } from '@threlte/extras';
	import { Sky } from '@threlte/extras';
	import { Debug } from '@threlte/rapier';

	import Player from './Player.svelte';
	import Platforms from './Level.svelte';

	import {
		currentLevel,
		playerPosition,
		showDebug,
		showShadows,
		platforms,
		selectedPlatform
	} from '../gamestate';

	import { onMount } from 'svelte';
	import CustomRenderer from '../helper/CustomRenderer.svelte';

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

	let target: Object3D;

	let orbitControls: OrbitControls;

	$: orbitTarget =
		$selectedPlatform >= 0 && $selectedPlatform < $platforms.length
			? $platforms[$selectedPlatform].position
			: [0, 0, 0];
</script>

<svelte:window
	on:keydown={(ev) => {
		if ($page.state.gameState !== 'edit') return;
		const moveSpeed = 5;
		// move target with arrow keys
		if (ev.key == 'ArrowUp') {
			$playerPosition[1] += moveSpeed;
		}
		if (ev.key == 'ArrowDown') {
			$playerPosition[1] -= moveSpeed;
		}
		if (ev.key == 'ArrowLeft') {
			$playerPosition[0] -= moveSpeed;
		}
		if (ev.key == 'ArrowRight') {
			$playerPosition[0] += moveSpeed;
		}

		$playerPosition = [...$playerPosition];
	}}
	on:mouseup={() => {
		if (orbitControls) {
			orbitControls.update();
		}
	}}
/>

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
	<!-- show little indicator for where the player spawns -->
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

<Platforms />

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
