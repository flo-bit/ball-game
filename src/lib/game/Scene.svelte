<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { OrbitControls, Environment, Text, Align, AudioListener, Audio } from '@threlte/extras';
	import Sky from './backgrounds/Sky/Sky.svelte';
	import Space from './backgrounds/Space/Space.svelte';
	import { Debug } from '@threlte/rapier';

	import Stats from 'stats.js';
	import { page } from '$app/stores';
	import { DirectionalLight, Object3D, Box3, Vector3, LinearEncoding } from 'three';

	import Player from './Player.svelte';
	import Level from './Level.svelte';

	// import Splat from './backgrounds/gaussian/Splat.svelte';

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

	let center = new Vector3(0, 0, 0);
	let oldCenter = new Vector3(0, 0, 0);
	let position: [number, number, number] = [0, 0, 0];

	useTask(() => {
		if (stats) stats.update();
		// if(!levelWrapper) return;

		oldCenter.copy(center);
		let bbox = new Box3().setFromObject(levelWrapper);
		bbox.getCenter(center);
		center.add(oldCenter);

		// if not close to zero
		if (center.length() > 0.1) {
			position = [-center.x, -center.y, -center.z]
		}
	});

	let dirLight: DirectionalLight;

	let target: Object3D;

	let orbitControls: OrbitControls;

	$: orbitTarget =
		$selectedPlatform >= 0 && $selectedPlatform < $platforms.length
			? $platforms[$selectedPlatform].position
			: [0, 0, 0];

	let levelWrapper: Object3D;

	$: if (levelWrapper) {
		let bbox = new Box3().setFromObject(levelWrapper);
		console.log(bbox);
	}


	function onKeyUp(e: KeyboardEvent) {
		switch (e.key) {
			case '1':
				$showDebug = !$showDebug;
				break;
			default:
				break;
		}
	}
</script>

<svelte:window
	on:mouseup={() => {
		if (orbitControls) {
			orbitControls.update();
		}
	}}

	on:keyup={onKeyUp}
/>

<AudioListener />

<Audio src="/audio/background.mp3" autoplay loop volume={0.5} />

{#if $showDebug}
	<Debug />
{/if}

{#if $page.state.gameState == 'playing'}
	{#if $currentLevel >= 0}
		<Player />
	{/if}
{:else if $page.state.gameState !== 'edit'}
	<T.PerspectiveCamera makeDefault position={[50, 30, 17]} fov={80} near={0.1} far={1000}>
		<OrbitControls autoRotate autoRotateSpeed={1.0} allowPan={false} maxDistance={200.0} minDistance={10.0}></OrbitControls>
	</T.PerspectiveCamera>
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

<T.Object3D bind:ref={levelWrapper} position={$page.state.gameState === 'playing' ? [0, 0, 0] : position}>
		<Level />
</T.Object3D>

<Sky />

<!-- <Space /> -->

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