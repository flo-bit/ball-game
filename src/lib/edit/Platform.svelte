<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { RoundedBoxGeometry, TransformControls } from '@threlte/extras';

	// @ts-ignore
	import type { TransformControls as TC } from 'three/examples/jsm/controls/TransformControls';
	import {
		editMode,
		editSpace,
		platforms,
		platformsHistory,
		selectedPlatform,
	} from '$lib/stores/edit';
	import * as THREE from 'three';

	import { interactivity } from '@threlte/extras';
	import type { PlatformType } from '$lib/types';
	import Lines from '$lib/helper/effects/Lines.svelte';
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

	let colors: Record<PlatformType, THREE.Color | string> = {
		start: new THREE.Color(0xd97706),
		win: new THREE.Color(0x7dd3fc),
		normal: new THREE.Color(0xfafaf9),
		force: new THREE.Color(0x10b981),
		bounce: new THREE.Color(0x7c3aed),
		slide: new THREE.Color(0xf59e0b)
	};

	export let type: PlatformType = 'normal';

	export let index: number;

	$: showTransform = $selectedPlatform == index;

	let ref: THREE.Object3D;

	let pointerDown = false;

	useTask(() => {
		if ($selectedPlatform == index) {
			position = ref.position.toArray() as [number, number, number];
			scale = ref.scale.toArray() as [number, number, number];
			rotation = ref.rotation.toArray() as [number, number, number];
		}
	});

	export let data: {
		forceAmount?: number;
		forceHeight?: number;
	} = {
		forceAmount: 50,
		forceHeight: 10
	};

	let snap = false;

	$: color = type ? colors[type] : colors['normal'];
</script>

<svelte:window
	on:keydown={(ev) => {
		if (ev.key == 'Shift') {
			snap = true;
		}
	}}
	on:keyup={(ev) => {
		if (ev.key == 'Shift') {
			snap = false;
		}
	}}
/>
<T.Object3D {position} {scale} {rotation} bind:ref>
	{#if type == 'win'}
		<T.Mesh receiveShadow>
			<RoundedBoxGeometry args={[1, 1 * 2.02, 1]} radius={0.1} />
			<T.MeshStandardMaterial color={new THREE.Color(0x0ea5e9)} />
		</T.Mesh>
	{/if}

	{#if type == 'force'}
		<T.Object3D position={[0, data.forceHeight ?? 5, 0]}>
			<Lines height={data.forceHeight} />
		</T.Object3D>
	{/if}
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
		<T.MeshStandardMaterial {color} roughness={0.5} />
	</T.Mesh>
	{#if $selectedPlatform == index}
		<T.Mesh>
			<RoundedBoxGeometry args={[2, 2, 2]} radius={0.1} />
			<T.MeshStandardMaterial color={'green'} roughness={0.5} transparent={true} opacity={0.4} />
		</T.Mesh>
	{/if}
	{#if showTransform}
		<TransformControls
			translationSnap={snap ? 1 : 0}
			rotationSnap={snap ? Math.PI / 8 : 0}
			scaleSnap={snap ? 0.1 : 0}
			object={ref}
			bind:controls
		></TransformControls>
	{/if}
</T.Object3D>
