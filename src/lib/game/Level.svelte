<script lang="ts">
	import {
		canEdit,
		currentLevel,
		customLevels,
		levels,
		platforms,
		playingCustomLevel
	} from '../gamestate';

	import Platform from './Platform.svelte';

	import type { Platform as PlatformType } from '$lib/types';

	let levelPlatforms: PlatformType[] = [];
	function setLevelPlatforms(edit: boolean, level: number, custom: boolean, platforms: PlatformType[]) {
		if (edit) {
			levelPlatforms = $platforms;
			return;
		}

		if(level < 0) {
			levelPlatforms = [];
			return;
		}

		if(custom) {
			if(level > $customLevels.length - 1) {
				levelPlatforms = [];
				return;
			}
			console.log(level)
			console.log($customLevels)
			console.log($customLevels[level])
			levelPlatforms = $customLevels[level].platforms;
		} else {
			if(level > levels.length - 1) {
				levelPlatforms = [];
				return;
			}
			levelPlatforms = levels[level].platforms;
		}
	}

	$: setLevelPlatforms($canEdit, $currentLevel, $playingCustomLevel, $platforms);
</script>

{#each levelPlatforms as platform, i}
	<Platform
		bind:scale={platform.scale}
		bind:position={platform.position}
		bind:rotation={platform.rotation}
		index={i}
		type={platform.type}
	/>
{/each}
