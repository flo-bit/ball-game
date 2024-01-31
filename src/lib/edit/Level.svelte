<script lang="ts">
	import { platforms } from '$lib/stores/edit';
	import Platform from './Platform.svelte';
</script>

{#each $platforms as platform, i}
	<Platform
		bind:scale={platform.scale}
		bind:position={platform.position}
		bind:rotation={platform.rotation}
        index={i}
		type={platform.type}
	/>
{/each}
