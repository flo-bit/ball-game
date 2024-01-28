<script lang="ts">
	import { Sky } from '@threlte/extras';
	import Cloud from './CloudBillboard.svelte';

	import { MathUtils } from 'three';

	let maxDist = 1000;

	let positions: [number, number, number][] = [];

	for (let i = 0; i < 200; i++) {
		let x = Math.pow(MathUtils.randFloatSpread(1), 3) * maxDist;
		let y = Math.random() * 20 - 45;
		let z = Math.pow(MathUtils.randFloatSpread(1), 3) * maxDist;


		positions.push([x, y, z]);
	}
</script>

<Sky elevation={4} />

{#each positions as position}
	<Cloud
		scale={[Math.random() * 40 + 50, 50, Math.random() * 40 + 50]}
		{position}
	/>
{/each}
