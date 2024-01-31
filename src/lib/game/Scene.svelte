<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { OrbitControls, AudioListener } from '@threlte/extras';
	import Sky from './backgrounds/Sky/Sky.svelte';
	import { Debug } from '@threlte/rapier';

	import Stats from 'stats.js';
	import { DirectionalLight, Object3D, Box3, Vector3 } from 'three';

	import Player from './Player.svelte';
	import Level from './Level.svelte';

	import {
		currentLevel,
		gameState,
		playerPosition,
	} from '$lib/gamestate';
	import { Inspector } from 'three-inspect';
	import { showDebug, showShadows } from '$lib/stores/settings';

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
	on:keyup={onKeyUp}
/>

<AudioListener />

<!-- <Audio src="/audio/background2.wav" autoplay loop volume={0.5} /> -->

{#if $showDebug}
	<Debug />
{/if}

{#if $gameState == 'playing'}
	{#if $currentLevel >= 0}
		<Player />
	{/if}
{:else}
	<T.PerspectiveCamera makeDefault position={[50, 30, 17]} fov={80} near={0.1} far={1000}>
		<OrbitControls autoRotate autoRotateSpeed={1.0} allowPan={false} maxDistance={200.0} minDistance={10.0}></OrbitControls>
	</T.PerspectiveCamera>
{/if}

<T.Object3D bind:ref={levelWrapper} position={$gameState === 'playing' ? [0, 0, 0] : position}>
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


<!-- <Inspector /> -->