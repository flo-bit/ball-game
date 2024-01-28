<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core';
	import * as THREE from 'three';
	
	import Stars from './Stars.svelte';
	import { onMount } from 'svelte';
	import PlanetModel from './PlanetModel.svelte';
	import Nebula from './Nebula.svelte';

	let rotation = 0;
	let distance = 1;
	useTask((delta) => {
		rotation += delta * 0.1;
	});

	const { scene, renderer } = useThrelte();

	let positions: [number, number, number][] = [];

	let vector = new THREE.Vector3();
		for (let i = 0; i < 10; i++) {
			vector.x = Math.random() * 1 - 0.5;
			vector.y = Math.random() * 1 - 0.5;
			vector.z = Math.random() * 1 - 0.5;
			vector.setLength(Math.random() * 200 + 100);
			positions.push([vector.x, vector.y, vector.z]);
		}

	onMount(() => {
		scene.background = new THREE.Color(0x000000);
		renderer.setClearColor(0x000000, 1);

	});


</script>

<!-- <T.AmbientLight intensity={0.1} /> -->

<PlanetModel
	scale={50}
	rotation.y={rotation}
	rotation.z={0.1}
	position.x={200}
	position.z={-20}
	position.y={0.5}
/>

<!-- this breaks scene background color :/ -->
<!-- <Environment files="env.jpg" isBackground={false} /> -->

<Stars />

{#each positions as [x, y, z], i}
	<Nebula position={[x, y, z]}/>
{/each}
<Nebula position={[0, 0, 200]}/>