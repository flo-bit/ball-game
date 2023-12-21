<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { RoundedBoxGeometry, TransformControls } from '@threlte/extras';

	// @ts-ignore
	import type { TransformControls as TC } from 'three/examples/jsm/controls/TransformControls';
	import { Collider } from '@threlte/rapier';
	import { editMode, editSpace, platforms, platformsHistory, selectedPlatform } from './gamestate';
	import * as THREE from 'three';

	import { interactivity } from '@threlte/extras';
	import { page } from '$app/stores';
	interactivity();

	export let scale: [number, number, number] = [1, 1, 1];
	export let position: [number, number, number] = [0, 0, 0];
	export let rotation: [number, number, number] | [number, number, number, THREE.EulerOrder] = [
		0, 0, 0
	];

	let controls: TC;

	let addedEventListener = false;

	$: if (controls && $editMode) {
		controls.mode = $editMode;
		controls.setSpace($editSpace);

		if (!addedEventListener) {
			addedEventListener = true;
			// @ts-ignore
			controls.addEventListener('dragging-changed', (event) => {
				if ($selectedPlatform != index) return;

				if (event.value) {
					$platformsHistory = [...$platformsHistory, window.structuredClone($platforms)];
				}
			});
		}
	}

	export let isWin = false;

	export let index: number;

	$: showTransform = $page.state.gameState == 'edit' && $selectedPlatform == index;

	let ref: THREE.Object3D;

	let pointerDown = false;

	useTask(() => {
		if ($selectedPlatform == index) {
			position = ref.position.toArray() as [number, number, number];
			scale = ref.scale.toArray() as [number, number, number];
			rotation = ref.rotation.toArray() as [number, number, number];
		}
	});
</script>

<T.Object3D {position} {scale} {rotation} bind:ref>
	{#if isWin}
		<T.Object3D position={[0, 4, 0]}>
			<Collider sensor shape={'cuboid'} args={[0.5, 4, 0.5]} type="dynamic" />
		</T.Object3D>

		<T.Mesh receiveShadow>
			<RoundedBoxGeometry args={[1, 1 * 2.02, 1]} radius={0.1} />
			<T.MeshStandardMaterial color={new THREE.Color(0x0ea5e9)} roughness={0.3} />
		</T.Mesh>
	{/if}
	<Collider shape={'cuboid'} args={[1, 1, 1]} type="dynamic" />
	<T.Mesh
		receiveShadow
		castShadow
		on:pointerdown={() => {
			pointerDown = true;
		}}
		on:pointerleave={() => {
			pointerDown = false;
		}}
		on:pointerup={() => {
			if (pointerDown) {
				$selectedPlatform = index;
			}
		}}
		on:pointercancel={() => {
			pointerDown = false;
		}}
		on:pointerout={() => {
			pointerDown = false;
		}}
	>
		<RoundedBoxGeometry args={[2, 2, 2]} radius={0.1} />
		<T.MeshStandardMaterial color={!isWin ? 'white' : new THREE.Color(0x7dd3fc)} roughness={0.5} />
	</T.Mesh>

	{#if showTransform}
		<TransformControls object={ref} bind:controls></TransformControls>
	{/if}
</T.Object3D>
