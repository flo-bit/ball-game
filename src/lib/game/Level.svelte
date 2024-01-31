<script lang="ts">
	import { currentLevel } from '../gamestate';

	import Platform from './Platform.svelte';

	import type { Platform as PlatformType } from '$lib/types';
	import { levels } from '$lib/levels';

	let levelPlatforms: PlatformType[] = [];
	function setLevelPlatforms(level: number) {
		if (level < 0 || level > levels.length - 1) {
			levelPlatforms = [];
			return;
		}
		levelPlatforms = levels[level].platforms;
	}

	$: setLevelPlatforms($currentLevel);
</script>

{#key $currentLevel}
	{#each levelPlatforms as platform}
		<Platform
			bind:scale={platform.scale}
			bind:position={platform.position}
			bind:rotation={platform.rotation}
			type={platform.type}
		/>
	{/each}
{/key}
