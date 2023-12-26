<script lang="ts">
	import type { Platform as PlatformType } from '$lib/types';
	import { T } from '@threlte/core';
	import { Align, OrbitControls } from '@threlte/extras';
	import Platform from './Platform.svelte';

	export let platforms: PlatformType[] = [];
</script>

<T.PerspectiveCamera makeDefault position={[30, 20, 10]} fov={80} near={0.1} far={1000}>
	<OrbitControls></OrbitControls>
</T.PerspectiveCamera>

<Align>
    {#each platforms as platform, i (platform)}
        <Platform
            bind:scale={platform.scale}
            bind:position={platform.position}
            bind:rotation={platform.rotation}
            index={i}
            type={platform.type}
            hasPhysics={false}
        />
    {/each}
</Align>
<T.DirectionalLight position={[0, 10, -10]} intensity={1.5} />
