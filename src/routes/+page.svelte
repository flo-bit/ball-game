<script>
	import { Canvas } from '@threlte/core';
	import { World } from '@threlte/rapier';

	import Scene from './Scene.svelte';
	import Menu from './Menu.svelte';
	import { currentLevel } from './gamestate';
	import EditControls from './EditControls.svelte';

	import * as ContextMenu from '$lib/components/ui/context-menu';
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger>
		<div class="fixed w-screen h-screen -z-10">
			<Canvas>
				<World>
					<Scene />
				</World>
			</Canvas>
		</div></ContextMenu.Trigger
	>
	<ContextMenu.Content>
		<ContextMenu.Item>Profile</ContextMenu.Item>
		<ContextMenu.Item>Billing</ContextMenu.Item>
		<ContextMenu.Item>Team</ContextMenu.Item>
		<ContextMenu.Item>Subscription</ContextMenu.Item>
	</ContextMenu.Content>
</ContextMenu.Root>

<Menu />

<EditControls />
