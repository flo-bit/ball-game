<script lang="ts">
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import { useRapier } from '@threlte/rapier';
	import Platform from './Platform.svelte';

	import {
		canEdit,
		currentLevel,
		editMode,
		editSpace,
		levels,
		platforms,
		selectedPlatform,
		startPlatforms
	} from './gamestate';

	const { rapier, world } = useRapier();
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
				navigator.clipboard.writeText(JSON.stringify($platforms));
				break;

			case 'p':
				$page.state.gameState = 'playing';
				break;

			case '+':
				$platforms = [
					...$platforms,
					{
						position: [0, 0, 0],
						scale: [4, 0.5, 4],
						rotation: [0, 0, 0]
					}
				];
				setTimeout(() => {
					$selectedPlatform = $platforms.length - 1;
				}, 100);
				break;

			case '-':
				if ($selectedPlatform != -1) {
					$platforms = $platforms.filter((_, i) => i != $selectedPlatform);
					$selectedPlatform = -1;
				}
				break;

			case 'd':
				console.log($selectedPlatform);
				console.log($platforms.length);
				// duplicate
				if ($selectedPlatform != -1) {
					$platforms = [...$platforms, { ...$platforms[$selectedPlatform] }];
					setTimeout(() => {
						$selectedPlatform = $platforms.length - 1;
					}, 100);
				}
				break;

			case 'x':
				$platforms = startPlatforms;
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
			isWin={platform.isWin}
		/>
	{/each}
{:else if $currentLevel >= 0}
	{#each levels[$currentLevel].platforms as platform, i (platform)}
		<Platform
			bind:scale={platform.scale}
			bind:position={platform.position}
			bind:rotation={platform.rotation}
			index={i}
			isWin={platform.isWin}
		/>
	{/each}
{/if}
