<script lang="ts">
	import { page } from '$app/stores';
	import {
		canEdit,
		currentLevel,
		customHighscores,
		customLevels,
		firstTime,
		highscores,
		levels,
		playLevel,
		playingCustomLevel,
		playingTime,
		showNewHighscore,
		showShadows
	} from '../../gamestate';

	import { pushState, replaceState } from '$app/navigation';

	import Button from '../elements/Button.svelte';
	import Glass from '../elements/Glass.svelte';

	import type { GameState } from '$lib/types';
	import { onMount } from 'svelte';

	onMount(() => {
		let i;
		for (i = 0; i < levels.length; i++) {
			if (i >= $highscores.length || $highscores[i] == null) {
				break;
			}
		}
		console.log(i);
		$currentLevel = Math.min(Math.max(i, 0), levels.length - 1);
	});

	function gotoState(state: GameState, levelPage: number | undefined = undefined) {
		pushState('', {
			gameState: state,
			levelPage: levelPage
		});
	}
	function toggleFullscreen() {
		if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
			document.documentElement.requestFullscreen();
		} else if (document.exitFullscreen) {
			document.exitFullscreen();
		}
	}

	function toggleShadows() {
		$showShadows = !$showShadows;
	}
</script>

{#if ($page.state.gameState != 'edit' && $page.state.gameState != 'playing' && $page.state.gameState != 'levels') || ($playingTime < 0 && !$canEdit)}
	<div
		class="fixed inset-0 w-screen h-screen z-10 flex flex-col items-center justify-center px-2 overflow-scroll text-gray-900"
	>
		{#if !$page.state.gameState || $page.state.gameState == 'menu'}
			<Glass credits={true} class="w-full max-w-xl px-5 sm:px-10 relative">
				<div class="text-6xl font-semibold tracking-tight text-center rounded-md mb-16 ">
					marble<wbr>llous
				</div>

				<div class="w-full max-w-xs mx-auto flex flex-col space-y-6">
					<Button
						onClick={() => {
							if ($firstTime) {
								$firstTime = false;
								gotoState('gameHelp');
							} else {
								let i = undefined;
								// find first not done level
								for (i = 0; i < levels.length; i++) {
									if (i >= $highscores.length || $highscores[i] == null) {
										break;
									}
								}

								gotoState('levels', Math.max(Math.floor((i - 1) / 6), 0));
							}
						}}>play</Button
					>
					<!-- <Button onClick={() => gotoState('customLevels')}>custom levels</Button> -->
					<div class="flex gap-2">
					<Button onClick={() => gotoState('gameHelp')}>tutorial</Button>
					<Button onClick={() => gotoState('settings')}>settings</Button>
				</div>
				</div>
			</Glass>
		{:else if $page.state.gameState == 'editHelp'}
			<Glass backButton={true} class="w-full max-w-xl px-5 sm:px-10 relative">
				<div class="text-4xl font-semibold">HELP</div>
				<div class="mt-10 text-xl font-semibold">
					<p>Click on a platform to select it</p>
					<div class="text-sm font-normal mb-5">
						<p>T to translate</p>
						<p>R to rotate</p>
						<p>S to scale</p>
						<p>W for world space</p>
						<p>L for local space</p>
					</div>

					<p>Try it yourself</p>
					<div class="text-sm font-normal mb-5">
						<p>Press P to play.</p>
						<p>Press K to go back to edit.</p>
					</div>
					<p>Add and delete platforms</p>
					<div class="text-sm font-normal mb-5">
						<p>+ to add a platform</p>
						<p>- to delete the currently selected platform</p>
						<p>D to duplicate the currently selected platform</p>
						<p>X to clear the level</p>
					</div>

					<p>Copy the level</p>
					<div class="text-sm font-normal mb-5">
						<p>C to copy the level to your clipboard</p>
					</div>
				</div>
				<button
					on:click={() => {}}
					class="mt-10 text-xl p-4 px-8 font-semibold rounded-md ring-1 ring-white hover:bg-white/40"
					>OK</button
				>
			</Glass>
		{:else if $page.state.gameState == 'gameHelp'}
			<Glass backButton={true} class="w-full max-w-xl px-5 sm:px-10 relative">
				<div class="text-6xl font-semibold tracking-tight text-center rounded-md mb-12">
					how to play
				</div>
				<div class="text-xl font-semibold">
					<div class="grid grid-cols-1 sm:grid-cols-2 text-center">
						<div>
							<p class="text-3xl">movement</p>
							<div class="text-base font-semibold mb-5 mt-2">
								<p>w/a/s/d to move</p>
								<p>space to jump</p>
							</div>
						</div>
						<div>
							<p class="text-3xl">camera</p>
							<div class="text-base font-semibold mb-5 mt-2">
								<p>move mouse to rotate</p>
							</div>
						</div>
					</div>
					<p class="text-3xl font-bold my-10 text-center">get to the blue platform</p>
				</div>
				<div class="flex justify-center">
					<Button onClick={() => gotoState('levels')}>let's go</Button>
				</div>
			</Glass>
		{:else if $page.state.gameState == 'won'}
			<Glass class="w-full max-w-xl px-5 sm:px-10 relative">
				<div class="text-6xl font-semibold tracking-tight text-center rounded-md mb-12">
					well done!
				</div>

				{#if $showNewHighscore && $highscores[$currentLevel]}
					<div class="text-emerald-600 font-semibold text-center mb-12 text-xl">
						new highscore:<br />{$highscores[$currentLevel].toFixed(2)} seconds
					</div>
				{/if}

				<div class="w-full max-w-xs mx-auto flex flex-col space-y-6">
					<Button
						onClick={() => {
							playLevel($currentLevel, true);
						}}>play again</Button
					>
					<Button
						onClick={() => {
							if ($playingCustomLevel) {
								replaceState('', {
									gameState: 'customLevels',
									levelPage: Math.floor($currentLevel / 6)
								});
							} else {
								replaceState('', {
									gameState: 'levels',
									levelPage: Math.floor($currentLevel / 6)
								});
							}
						}}>back to levels</Button
					>
					{#if !$playingCustomLevel ? $currentLevel < levels.length - 1 : $currentLevel < $customLevels.length - 1}
						<Button
							onClick={() => {
								playLevel($currentLevel + 1, true);
							}}>next level</Button
						>
					{/if}
				</div>
			</Glass>
		{:else if $page.state.gameState == 'playing'}
			<div class="text-9xl font-extrabold tracking-tight text-center rounded-md text-gray-900">
				{-Math.floor($playingTime)}
			</div>
		{:else if $page.state.gameState == 'settings'}
			<Glass backButton={true} class="w-full max-w-xl px-5 sm:px-10 relative">
				<div class="text-6xl font-semibold tracking-tight text-center rounded-md mb-12">
					settings
				</div>

				<div class="w-full max-w-xs mx-auto flex flex-col space-y-6">
					<Button onClick={toggleFullscreen}>toggle fullscreen</Button>
					<Button onClick={toggleShadows}>toggle shadows</Button>
					<Button
						onClick={() => {
							$highscores = [];
							$customHighscores = [];
						}}>reset scores</Button
					>
				</div>
			</Glass>
		{/if}
	</div>
{/if}

{#if $page.state.gameState == 'levels' && $currentLevel >= 0}
	<div class="fixed w-full justify-center flex top-2">
		<button
			class="opacity-80 hover:opacity-100 transition-opacity duration-100"
			on:click={() => {
				replaceState('', {
					gameState: 'menu'
				});
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
				class="w-8 h-8"
			>
				<path
					d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z"
				/>
				<path
					d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z"
				/>
			</svg>
		</button>
	</div>

	<div class="fixed z-10 flex w-full justify-center px-2 text-gray-900 bottom-0">
		<div
			class="text-2xl bg-white/50 backdrop-blur-sm py-12 px-16 rounded-t-xl flex flex-col gap-4 font-semibold w-full"
		>
			<div class="flex flex-col w-full gap-4">
				<div class="text-4xl">Level {$currentLevel + 1}</div>
				<div class="text-2xl font-base italic">"{levels[$currentLevel].name}"</div>
			</div>
			<div class="text-sm font-normal pt-2 flex justify-between">
				<div>No highscore</div>
				<div>10.0</div>
			</div>
		</div>
	</div>

	<div class="fixed inset-0 flex justify-between items-center z-10 pointer-events-none">
		<div class="flex gap-4 justify-between w-full py-4">
			<button
				on:click={() => {
					$currentLevel = Math.max(0, $currentLevel - 1);
				}}
				class="disabled:opacity-30 disabled:cursor-not-allowed pointer-events-auto hover:opacity-50 transition-opacity duration-100"
				disabled={$currentLevel <= 0}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-10 h-10"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
				</svg>
			</button>
			<button
				class="bg-white/70 rounded-full p-3 backdrop-blur-sm pointer-events-auto opacity-80 hover:opacity-100 transition-opacity duration-100"
				on:click={() => {
					playLevel($currentLevel, false);
				}}
				><svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					class="w-20 h-20 pl-2"
				>
					<path
						fill-rule="evenodd"
						d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
			<button
				on:click={() => {
					$currentLevel = Math.min(levels.length - 1, $currentLevel + 1);
				}}
				class="disabled:opacity-30 disabled:cursor-not-allowed pointer-events-auto hover:opacity-50 transition-opacity duration-100"
				disabled={$currentLevel >= levels.length - 1}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-10 h-10"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
				</svg>
			</button>
		</div>
	</div>
{/if}

{#if $page.state.gameState == 'playing' && $playingTime > 0 && !$canEdit}
	<div class="fixed top-1 right-2 text-xl font-semibold tracking-tight text-center rounded-md">
		{$playingTime.toFixed(1)}
	</div>
{/if}

<!-- {#if $state == 'won'}
					{#if $currentLevel < levels.length - 1}
						<button
							on:click={() => {
								$currentLevel += 1;
								$state = 'playing';
							}}
							class="mt-10 text-xl p-4 px-8 font-semibold rounded-md ring-1 ring-white hover:bg-white/40"
							>NEXT</button
						>
					{:else}
						<button
							on:click={() => {
								$currentLevel = 0;
								$state = 'playing';
							}}
							class="mt-10 text-xl p-4 px-8 font-semibold rounded-md ring-1 ring-white hover:bg-white/40"
							>START OVER</button
						>
					{/if}
				{:else} -->
