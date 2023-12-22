<script lang="ts">
	import { pushState, replaceState } from '$app/navigation';
	import { page } from '$app/stores';
	import { useRapier } from '@threlte/rapier';
	import Platform from './Platform.svelte';

	import {
		canEdit,
		currentLevel,
		customLevels,
		editMode,
		editSpace,
		levels,
		platforms,
		playing,
		playingCustomLevel,
		selectedPlatform,
		startPlatforms,
		platformsHistory,
		showSaveLevelDialog
	} from './gamestate';
	import type { PlatformType } from '$lib/types';

	function newPlatform(type: PlatformType) {
		$platformsHistory = [...$platformsHistory, window.structuredClone($platforms)];

		$platforms = [
			...$platforms,
			{
				position: [0, 0, 0],
				scale: [4, 0.5, 4],
				rotation: [0, 0, 0],
				type: type
			}
		];
		setTimeout(() => {
			$selectedPlatform = $platforms.length - 1;
		}, 100);
	}
</script>

<svelte:window
	on:keydown={(ev) => {
		if (ev.key == '?') {
			// show help

			if ($page.state.gameState == 'edit') {
				pushState('', {
					gameState: 'editHelp'
				});
			} else {
				pushState('', {
					gameState: 'gameHelp'
				});
			}
		}

		if ($page.state.gameState != 'edit') return;

		switch (ev.key) {
			case 'Escape':
				$selectedPlatform = -1;
				break;
			case 's':
				$editMode = 'scale';
				break;
			case 'r':
				$editMode = 'rotate';
				break;
			case 't':
				$editMode = 'translate';
				break;
			case 'w':
				$editSpace = 'world';
				break;
			case 'l':
				$editSpace = 'local';
				break;
			case 'c':
				// copy to clipboard
				navigator.clipboard.writeText(JSON.stringify({ name: 'New Level', platforms: $platforms }));
				break;
			case 'p':
				$playing = true;
				replaceState('', {
					gameState: 'playing'
				});
				break;

			case '+':
				newPlatform('normal');
				break;

			case 'g':
				newPlatform('win');
				break;
			case 'f':
				newPlatform('force');
				break;

			case '-':
				$platformsHistory = [...$platformsHistory, window.structuredClone($platforms)];

				if ($selectedPlatform != -1) {
					$platforms = $platforms.filter((_, i) => i != $selectedPlatform);
					$selectedPlatform = -1;
				}
				break;

			case 'd':
				$platformsHistory = [...$platformsHistory, window.structuredClone($platforms)];

				// duplicate
				if ($selectedPlatform != -1) {
					$platforms = [...$platforms, { ...$platforms[$selectedPlatform] }];
					setTimeout(() => {
						$selectedPlatform = $platforms.length - 1;
					}, 100);
				}
				break;
			case 'x':
				$platformsHistory = [window.structuredClone($platforms)];

				$platforms = startPlatforms;
				break;
			case 'n':
				$showSaveLevelDialog = true;
				break;

			case 'z':
				// undo
				console.log('undo', $platformsHistory.length);

				let last = $platformsHistory.pop();
				$platformsHistory = [...$platformsHistory];
				if (last) $platforms = [...last];
				break;
			case 'y':
				// redo?
				break;

			default:
				break;
		}
	}}
/>

{#if $canEdit}
	{#each $platforms as platform, i}
		<Platform
			bind:scale={platform.scale}
			bind:position={platform.position}
			bind:rotation={platform.rotation}
			index={i}
			type={platform.type}
		/>
	{/each}
{:else if $currentLevel >= 0}
	{#if $playingCustomLevel}
		{#each $customLevels[$currentLevel].platforms as platform, i (platform)}
			<Platform
				bind:scale={platform.scale}
				bind:position={platform.position}
				bind:rotation={platform.rotation}
				index={i}
				type={platform.type}
			/>
		{/each}
	{:else}
		{#each levels[$currentLevel].platforms as platform, i (platform)}
			<Platform
				bind:scale={platform.scale}
				bind:position={platform.position}
				bind:rotation={platform.rotation}
				index={i}
				type={platform.type}
			/>
		{/each}
	{/if}
{/if}
