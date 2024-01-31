<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { OrbitControls } from '@threlte/extras';
	import Sky from '../game/backgrounds/Sky/Sky.svelte';
	import { Debug } from '@threlte/rapier';

	import Stats from 'stats.js';
	import { DirectionalLight } from 'three';

	import Level from './Level.svelte';

	import { platforms, selectedPlatform } from '$lib/stores/edit';
	import { showDebug } from '$lib/stores/settings';

	let stats: Stats | undefined;

	$: if ($showDebug && document && !stats) {
		stats = new Stats();
		document.body.appendChild(stats.dom);
	}
	$: if (!$showDebug && stats) {
		stats.dom.remove();
		stats = undefined;
	}

	let position: [number, number, number] = [0, 0, 0];

	useTask(() => {
		if (stats) stats.update();
	});

	let dirLight: DirectionalLight;
	let orbitControls: OrbitControls;

	$: orbitTarget =
		$selectedPlatform >= 0 && $selectedPlatform < $platforms.length
			? $platforms[$selectedPlatform].position
			: [0, 0, 0];

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

{#if $showDebug}
	<Debug />
{/if}

<T.Object3D position={[0, -10, 0]}>
	<T.GridHelper args={[300, 20, 'red', 'red']} />
</T.Object3D>

<T.PerspectiveCamera makeDefault fov={75} near={0.1} far={1000}>
	<OrbitControls bind:ref={orbitControls} target={orbitTarget}></OrbitControls>
</T.PerspectiveCamera>

<Level />

<Sky />

<T.DirectionalLight ref={dirLight} position={[0, 10, -10]} intensity={1.0} />
