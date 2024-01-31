<script lang="ts">
	import {
		currentLevel,
		firstTime,
		gameState,
		highscores,
		playLevel,
		playingTime,
		showNewHighscore
	} from '$lib/gamestate';

	import { levels } from '$lib/levels';
	import { Button } from '$lib/components/ui/button';
	import { showShadows } from '$lib/stores/settings';

	import Glass from '$lib/ui/elements/Glass.svelte';
	import Joystick from '$lib/ui/elements/Joystick.svelte';

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

{#if $gameState != 'playing'}
	<div
		class="fixed inset-0 w-screen h-screen z-10 flex flex-col items-center justify-end px-2 overflow-scroll text-gray-900 pointer-events-none"
	>
		{#if $gameState == 'menu'}
			<Glass credits={true}>
				<div class="text-4xl font-semibold tracking-tight text-center rounded-md mb-8">
					marble<wbr />llous
				</div>

				<div class="w-full max-w-xs mx-auto flex items-center justify-between">
					<Button variant="custom" size="none" on:click={() => ($gameState = 'help')} class="p-3">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 320 512"
							stroke="currentColor"
							class="w-6 h-6"
							><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
								d="M80 160c0-35.3 28.7-64 64-64h32c35.3 0 64 28.7 64 64v3.6c0 21.8-11.1 42.1-29.4 53.8l-42.2 27.1c-25.2 16.2-40.4 44.1-40.4 74V320c0 17.7 14.3 32 32 32s32-14.3 32-32v-1.4c0-8.2 4.2-15.8 11-20.2l42.2-27.1c36.6-23.6 58.8-64.1 58.8-107.7V160c0-70.7-57.3-128-128-128H144C73.3 32 16 89.3 16 160c0 17.7 14.3 32 32 32s32-14.3 32-32zm80 320a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"
							/></svg
						>
					</Button>
					<Button
						variant="custom"
						size="none"
						on:click={() => {
							if ($firstTime) {
								$firstTime = false;
								$gameState = 'help';
							} else {
								let i = undefined;
								// find first not done level
								for (i = 0; i < levels.length; i++) {
									if (i >= $highscores.length || $highscores[i] == null) {
										break;
									}
								}

								$gameState = 'levels';
							}
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
						</svg></Button
					>

					<Button
						variant="custom"
						size="none"
						class="p-3"
						on:click={() => ($gameState = 'settings')}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 512 512"
							stroke="currentColor"
							class="w-6 h-6"
							><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
								d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"
							/></svg
						>
					</Button>
				</div>
			</Glass>
		{:else if $gameState == 'help'}
			<Glass backButton={true}>
				<div class="text-xl font-semibold">
					<div class="grid grid-cols-1 sm:grid-cols-2 text-center">
						<div>
							<p class="text-3xl">movement</p>
							<div class="text-base font-semibold">
								<p>w/a/s/d to move</p>
								<p>space to jump</p>
							</div>
						</div>
						<div>
							<p class="text-3xl">camera</p>
							<div class="text-base font-semibold">
								<p>move mouse to rotate</p>
							</div>
						</div>
					</div>
					<p class="text-3xl font-bold my-4 mb-8 text-center">get to the blue platform</p>
				</div>
				<div class="flex justify-center">
					<Button on:click={() => ($gameState = 'levels')} variant="custom">let's go</Button>
				</div>
			</Glass>
		{:else if $gameState == 'won'}
			<Glass class="w-full max-w-xl px-5 sm:px-10 relative">
				<div class="text-4xl font-semibold tracking-tight text-center">well done!</div>
				{#if $showNewHighscore && $highscores[$currentLevel]}
					<div class="text-sm text-center font-semibold mt-2 text-green-800">
						new highscore: {$highscores[$currentLevel]
							? $highscores[$currentLevel].toFixed(2) + 's'
							: 'none'}
					</div>
				{/if}

				<div class="w-full max-w-xs mx-auto flex items-center justify-between mt-8">
					<Button
						variant="custom"
						size="none"
						on:click={() => {
							playLevel($currentLevel);
						}}
						class="p-3"
					>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-6 h-6"
							><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
								d="M48.5 224H40c-13.3 0-24-10.7-24-24V72c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2L98.6 96.6c87.6-86.5 228.7-86.2 315.8 1c87.5 87.5 87.5 229.3 0 316.8s-229.3 87.5-316.8 0c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0c62.5 62.5 163.8 62.5 226.3 0s62.5-163.8 0-226.3c-62.2-62.2-162.7-62.5-225.3-1L185 183c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8H48.5z"
							/></svg
						>
					</Button>
					<Button
						variant="custom"
						size="none"
						on:click={() => {
							playLevel($currentLevel + 1);
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							class="w-20 h-20 pl-1"
						>
							<path
								d="M5.055 7.06C3.805 6.347 2.25 7.25 2.25 8.69v8.122c0 1.44 1.555 2.343 2.805 1.628L12 14.471v2.34c0 1.44 1.555 2.343 2.805 1.628l7.108-4.061c1.26-.72 1.26-2.536 0-3.256l-7.108-4.061C13.555 6.346 12 7.249 12 8.689v2.34L5.055 7.061Z"
							/>
						</svg>
					</Button>

					<Button
						variant="custom"
						size="none"
						on:click={() => {
							$gameState = 'levels';
						}}
						class="p-3"
					>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-6 h-6"
							><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
								d="M64 144a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zM64 464a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm48-208a48 48 0 1 0 -96 0 48 48 0 1 0 96 0z"
							/></svg
						>
					</Button>
				</div>
			</Glass>
		{:else if $gameState == 'settings'}
			<Glass backButton={true} class="w-full max-w-xl px-5 sm:px-10 relative">
				<div class="text-6xl font-semibold tracking-tight text-center rounded-md mb-12">
					settings
				</div>

				<div class="w-full max-w-xs mx-auto flex flex-col space-y-6">
					<Button on:click={toggleFullscreen}>toggle fullscreen</Button>
					<Button on:click={toggleShadows}>toggle shadows</Button>
					<Button
						on:click={() => {
							$highscores = [];
						}}>reset scores</Button
					>
				</div>
			</Glass>
		{:else if $gameState == 'levels' && $currentLevel >= 0}
			<Glass backButton={true}>
				<div class="text-4xl font-semibold tracking-tight text-center">
					#{$currentLevel + 1}
					{levels[$currentLevel].name}
				</div>

				<div class="text-sm text-center mt-2 mb-8 text-green-800 font-semibold">
					highscore: {$highscores[$currentLevel]
						? $highscores[$currentLevel].toFixed(2) + 's'
						: 'none'}
				</div>

				<div class="w-full max-w-xs mx-auto flex items-center justify-between">
					<Button
						variant="custom"
						size="none"
						on:click={() => {
							$currentLevel = Math.max(0, $currentLevel - 1);
						}}
						class="p-3 disabled:opacity-30 disabled:cursor-not-allowed"
						disabled={$currentLevel <= 0}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-6 h-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M15.75 19.5 8.25 12l7.5-7.5"
							/>
						</svg>
					</Button>
					<Button
						variant="custom"
						size="none"
						on:click={() => {
							playLevel($currentLevel);
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
						</svg></Button
					>

					<Button
						variant="custom"
						size="none"
						on:click={() => {
							$currentLevel = Math.min(levels.length - 1, $currentLevel + 1);
						}}
						class="p-3 disabled:opacity-30 disabled:cursor-not-allowed "
						disabled={$currentLevel >= levels.length - 1}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-6 h-6"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
						</svg>
					</Button>
				</div>
			</Glass>
		{/if}
	</div>
{:else}
	{#if $playingTime >= 0}
		<div
			class="fixed top-1 right-2 text-xl font-semibold tracking-tight text-left rounded-md flex items-center gap-2 z-20"
		>
			{$playingTime.toFixed(1)}
			<Button
				variant="custom"
				size="none"
				on:click={() => {
					$gameState = 'levels';
				}}
				class="p-2"
			>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-4 h-4"
					><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
						d="M64 144a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zM64 464a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm48-208a48 48 0 1 0 -96 0 48 48 0 1 0 96 0z"
					/></svg
				>
			</Button>
		</div>
	{:else}
		<div
			class="fixed inset-0 flex justify-center items-center text-9xl font-extrabold rounded-md text-gray-900"
		>
			{-Math.floor($playingTime)}
		</div>
	{/if}
{/if}
