<script lang="ts">
	import { pushState, replaceState } from '$app/navigation';
	import { page } from '$app/stores';
	import * as Menubar from '$lib/components/ui/menubar';
	import {
		canEdit,
		platforms,
		platformsHistory,
		selectedPlatform,
		playing,
		editMode,
		customLevels,
		showSaveLevelDialog,
		startPlatforms,
		editSpace
	} from '../../gamestate';
	import { Input } from '$lib/components/ui/input';

	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import type { PlatformType } from '$lib/types';

	let levelName = '';

	function newPlatform(type: PlatformType = 'normal') {
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

	function setEditMode(mode: 'translate' | 'rotate' | 'scale') {
		$editMode = mode;
	}

	function setEditSpace(space: 'local' | 'world') {
		$editSpace = space;
	}

	function copyToClipboard() {
		navigator.clipboard.writeText(JSON.stringify({ name: 'New Level', platforms: $platforms }));
	}

	function addStateToHistory() {
		$platformsHistory = [...$platformsHistory, window.structuredClone($platforms)];
	}

	function duplicatePlatform() {
		addStateToHistory();

		// duplicate
		if ($selectedPlatform != -1) {
			$platforms = [...$platforms, { ...$platforms[$selectedPlatform] }];
			setTimeout(() => {
				$selectedPlatform = $platforms.length - 1;
			}, 100);
		}
	}

	function deletePlatform() {
		addStateToHistory();

		// duplicate
		if ($selectedPlatform != -1) {
			$platforms = $platforms.filter((_, i) => i != $selectedPlatform);
			$selectedPlatform = -1;
		}
	}

	function undo() {
		// undo
		console.log('undo', $platformsHistory.length);

		let last = $platformsHistory.pop();
		$platformsHistory = [...$platformsHistory];
		if (last) $platforms = [...last];
	}

	function redo() {
		// redo?
	}

	function clearPlatforms() {
		$platformsHistory = [window.structuredClone($platforms)];

		$platforms = startPlatforms;
	}

	function saveLevel() {
		$customLevels = [
			...$customLevels,
			{
				name: levelName,
				platforms: $platforms
			}
		];
	}

	function togglePlaying() {
		$playing = !$playing;
		if ($playing) {
			replaceState('', {
				gameState: 'playing'
			});
		} else {
			replaceState('', {
				gameState: 'edit'
			});
		}
	}

	function showHelp() {
		pushState('', {
			gameState: 'editHelp'
		});
	}
</script>

<svelte:window
	on:keydown={(ev) => {
		if ($page.state.gameState != 'edit') return;

		switch (ev.key) {
			case 'Escape':
				$selectedPlatform = -1;
				break;
			case '?':
				showHelp();
				break;
			case 's':
				setEditMode('scale');
				break;
			case 'r':
				setEditMode('rotate');
				break;
			case 't':
				setEditMode('translate');
				break;
			case 'w':
				setEditSpace('world');
				break;
			case 'l':
				setEditSpace('local');
				break;
			case 'c':
				// copy to clipboard
				copyToClipboard();
				break;
			case 'p':
				togglePlaying();
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
			case 'y':
				newPlatform('slide');
				break;

			case 'b':
				newPlatform('bounce');

			case '-':
				deletePlatform();
				break;

			case 'd':
				duplicatePlatform();
				break;

			case 'x':
				clearPlatforms();
				break;

			case 'n':
				$showSaveLevelDialog = true;
				break;

			case 'z':
				undo();
				break;

			case 'y':
				// redo?
				break;

			default:
				break;
		}
	}}
/>

{#if $page.state.gameState == 'edit' || ($page.state.gameState == 'playing' && $canEdit)}
	<Menubar.Root>
		<Menubar.Menu>
			<Menubar.Trigger>level</Menubar.Trigger>
			<Menubar.Content>
				<Menubar.Item
					on:click={() => {
						clearPlatforms();
					}}
				>
					clear
					<Menubar.Shortcut>x</Menubar.Shortcut>
				</Menubar.Item>
				<Menubar.Item
					on:click={() => {
						$showSaveLevelDialog = true;
					}}
				>
					save

					<Menubar.Shortcut>n</Menubar.Shortcut>
				</Menubar.Item>
				<Menubar.Item
					on:click={() => {
						copyToClipboard();
					}}
				>
					share

					<Menubar.Shortcut>c</Menubar.Shortcut>
				</Menubar.Item>
			</Menubar.Content>
		</Menubar.Menu>
		<Menubar.Menu>
			<Menubar.Trigger>platform</Menubar.Trigger>
			<Menubar.Content>
				<Menubar.Item on:click={() => setEditMode('translate')}>
					move
					<Menubar.Shortcut>t</Menubar.Shortcut>
				</Menubar.Item>
				<Menubar.Item on:click={() => setEditMode('rotate')}>
					rotate

					<Menubar.Shortcut>t</Menubar.Shortcut>
				</Menubar.Item>
				<Menubar.Item on:click={() => setEditMode('scale')}>
					scale

					<Menubar.Shortcut>s</Menubar.Shortcut>
				</Menubar.Item>

				<Menubar.Separator />

				<Menubar.Item
					disabled={$selectedPlatform < 0}
					on:click={() => {
						deletePlatform();
					}}
					>delete

					<Menubar.Shortcut>-</Menubar.Shortcut></Menubar.Item
				>
				<Menubar.Separator />

				<Menubar.Sub>
					<Menubar.SubTrigger>new</Menubar.SubTrigger>
					<Menubar.SubContent>
						<Menubar.Item
							on:click={() => {
								newPlatform('normal');
							}}
							>normal

							<Menubar.Shortcut>+</Menubar.Shortcut>
						</Menubar.Item>
						<Menubar.Item
							on:click={() => {
								newPlatform('win');
							}}
							>win
							<Menubar.Shortcut>w</Menubar.Shortcut></Menubar.Item
						>
						<Menubar.Item
							on:click={() => {
								newPlatform('force');
							}}
							>force
							<Menubar.Shortcut>f</Menubar.Shortcut></Menubar.Item
						>
					</Menubar.SubContent>
				</Menubar.Sub>
				<Menubar.Item
					disabled={$selectedPlatform < 0}
					on:click={() => {
						duplicatePlatform();
					}}
					>duplicate

					<Menubar.Shortcut>d</Menubar.Shortcut></Menubar.Item
				>
			</Menubar.Content>
		</Menubar.Menu>
		<Menubar.Menu>
			<Menubar.Trigger>game</Menubar.Trigger>
			<Menubar.Content>
				<Menubar.Item
					on:click={() => {
						togglePlaying();
					}}
				>
					toggle playing mode
					<Menubar.Shortcut>p</Menubar.Shortcut>
				</Menubar.Item>
			</Menubar.Content>
		</Menubar.Menu>
	</Menubar.Root>
{/if}

<AlertDialog.Root bind:open={$showSaveLevelDialog}>
	<AlertDialog.Trigger />
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Save your level?</AlertDialog.Title>
			<AlertDialog.Description>
				Give your level a name to save it

				<div class="flex flex-col w-full max-w-sm gap-1.5 mt-2">
					<Input type="name" id="name" placeholder="Level name" bind:value={levelName} />
				</div>
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action
				on:click={() => {
					saveLevel();
				}}>Continue</AlertDialog.Action
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
