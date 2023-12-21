<script lang="ts">
	import { replaceState } from '$app/navigation';
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
		startPlatforms
	} from './gamestate';
	import { Input } from '$lib/components/ui/input';

	import * as AlertDialog from '$lib/components/ui/alert-dialog';

	let levelName = '';
</script>

{#if $page.state.gameState == 'edit' || ($page.state.gameState == 'playing' && $canEdit)}
	<Menubar.Root>
		<Menubar.Menu>
			<Menubar.Trigger>level</Menubar.Trigger>
			<Menubar.Content>
				<Menubar.Item
					on:click={() => {
						$platformsHistory = [window.structuredClone($platforms)];

						$platforms = startPlatforms;
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
						navigator.clipboard.writeText(
							JSON.stringify({ name: 'New Level', platforms: $platforms })
						);
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
				<Menubar.Item on:click={() => ($editMode = 'translate')}>
					move
					<Menubar.Shortcut>t</Menubar.Shortcut>
				</Menubar.Item>
				<Menubar.Item on:click={() => ($editMode = 'rotate')}>
					rotate

					<Menubar.Shortcut>t</Menubar.Shortcut>
				</Menubar.Item>
				<Menubar.Item on:click={() => ($editMode = 'scale')}>
					scale

					<Menubar.Shortcut>s</Menubar.Shortcut>
				</Menubar.Item>

				<Menubar.Separator />

				<Menubar.Item
					on:click={() => {
						if ($selectedPlatform == -1) return;
						$platformsHistory = [...$platformsHistory, window.structuredClone($platforms)];

						$platforms = $platforms.filter((_, i) => i != $selectedPlatform);
					}}
					>delete

					<Menubar.Shortcut>-</Menubar.Shortcut></Menubar.Item
				>
				<Menubar.Separator />

				<Menubar.Sub>
					<Menubar.SubTrigger>new</Menubar.SubTrigger>
					<Menubar.SubContent>
						<Menubar.Item>normal</Menubar.Item>
						<Menubar.Item>win</Menubar.Item>
						<Menubar.Item>force</Menubar.Item>
					</Menubar.SubContent>
				</Menubar.Sub>
				<Menubar.Item
					disabled={$selectedPlatform < 0}
					on:click={() => {
						$platformsHistory = [...$platformsHistory, window.structuredClone($platforms)];

						// duplicate
						$platforms = [...$platforms, { ...$platforms[$selectedPlatform] }];
						setTimeout(() => {
							$selectedPlatform = $platforms.length - 1;
						}, 100);
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
					disabled={$page.state.gameState == 'edit'}
					on:click={() => {
						if ($page.state.gameState == 'playing') {
							replaceState('', {
								gameState: 'edit'
							});
							$playing = false;
						}
					}}
				>
					edit mode
					<Menubar.Shortcut>k</Menubar.Shortcut>
				</Menubar.Item>
				<Menubar.Item
					disabled={$page.state.gameState == 'playing'}
					on:click={() => {
						if ($page.state.gameState == 'edit') {
							replaceState('', {
								gameState: 'playing'
							});
							$playing = true;
						}
					}}
				>
					play mode
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
					<Input type="email" id="name" placeholder="Level name" bind:value={levelName} />
				</div>
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action
				on:click={() => {
					$customLevels = [
						...$customLevels,
						{
							name: levelName,
							platforms: $platforms
						}
					];
				}}>Continue</AlertDialog.Action
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
