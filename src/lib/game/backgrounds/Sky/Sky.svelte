<script lang="ts">
	import { Sky } from '@threlte/extras';
	import Cloud from './CloudBillboard.svelte';

	let maxDist = 200;
</script>

<Sky elevation={4} />

{#each Array.from({ length: 100 }) as _}
	<Cloud
		scale={[Math.random() * 40 + 50, 50, Math.random() * 40 + 50]}
		position={[
			Math.random() * maxDist - maxDist / 2,
			Math.random() * 20 - 45,
			Math.random() * maxDist - maxDist / 2
		]}
	/>
{/each}
