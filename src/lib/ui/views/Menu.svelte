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
	import Levels from '../elements/MenuLevels.svelte';

	import type { GameState } from '$lib/types';

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

	function requestOrientationPermission() {
		// @ts-ignore
		if (typeof DeviceOrientationEvent.requestPermission === 'function') {
			// @ts-ignore
			DeviceOrientationEvent.requestPermission();
		}
	}
</script>

{#if ($page.state.gameState != 'edit' && $page.state.gameState != 'playing') || ($playingTime < 0 && !$canEdit)}
	<div
		class="fixed inset-0 w-screen h-screen z-10 flex flex-col items-center justify-center px-2 overflow-scroll text-gray-900"
	>
		{#if !$page.state.gameState || $page.state.gameState == 'menu'}
			<Glass credits={true} class="w-full max-w-xl px-5 sm:px-10 relative">
				<div class="text-6xl font-semibold tracking-tight text-center rounded-md mb-16">
					ball game
				</div>

				<div class="w-full max-w-xs mx-auto flex flex-col space-y-6">
					<Button
						onClick={() => {
							requestOrientationPermission();

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
						}}>play levels</Button
					>
					<Button onClick={() => gotoState('customLevels')}>custom levels</Button>
					<Button onClick={() => gotoState('gameHelp')}>how to play</Button>
					<Button onClick={() => gotoState('settings')}>settings</Button>
				</div>
			</Glass>
		{:else if $page.state.gameState == 'levels'}
			<Glass backButton={true} class="w-full max-w-xl px-5 sm:px-10 relative">
				<Levels {levels} />
			</Glass>
		{:else if $page.state.gameState == 'customLevels'}
			<Glass backButton={true} class="w-full max-w-xl px-5 sm:px-10 relative">
				<Levels levels={$customLevels} customLevels={true} />
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
								<p>click and drag to rotate or</p>
								<p>use q and e</p>
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
