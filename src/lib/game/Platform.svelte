<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { RoundedBoxGeometry, TransformControls } from '@threlte/extras';
	import { Edges } from '@threlte/extras';

	// @ts-ignore
	import type { TransformControls as TC } from 'three/examples/jsm/controls/TransformControls';
	import { Collider, CollisionGroups } from '@threlte/rapier';
	import {
		canEdit,
		currentLevel,
		customHighscores,
		editMode,
		editSpace,
		highscores,
		platforms,
		platformsHistory,
		playingCustomLevel,
		playingTime,
		selectedPlatform,
		showNewHighscore,
		playing
	} from '../gamestate';
	import * as THREE from 'three';

	import { interactivity } from '@threlte/extras';
	import { page } from '$app/stores';
	import type { PlatformType } from '$lib/types';
	import { replaceState } from '$app/navigation';
	import type { RigidBody } from '@dimforge/rapier3d-compat';
	import Lines from '../helper/effects/Lines.svelte';
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
		win: new THREE.Color(0x7dd3fc),
		normal: new THREE.Color(0xfafaf9),
		force: new THREE.Color(0x10b981),
		bounce: new THREE.Color(0x7c3aed),
		slide: new THREE.Color(0xf59e0b)
	};

	export let type: PlatformType = 'normal';

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

	function levelDone() {
		let time = $playingTime;

		$showNewHighscore = false;
		// check if new best time
		if ($playingCustomLevel) {
			if (!$customHighscores[$currentLevel] || $customHighscores[$currentLevel] > time) {
				$customHighscores[$currentLevel] = time;
				$showNewHighscore = true;
			}
		} else {
			if (!$highscores[$currentLevel] || $highscores[$currentLevel] > time) {
				$highscores[$currentLevel] = time;
				$showNewHighscore = true;
			}
		}

		replaceState('', {
			gameState: 'won'
		});

		$playing = false;
	}

	export let hasPhysics = true;

	export let data: {
		forceAmount?: number;
		forceHeight?: number;
	} = {
		forceAmount: 50,
		forceHeight: 10
	};

	let applyForce: RigidBody | null = null;

	let snap = false;

	useTask(() => {
		if (applyForce) {
			const vector = new THREE.Vector3(0, 1, 0);
			// rotate using rotation
			vector.applyEuler(new THREE.Euler(rotation[0], rotation[1], rotation[2]));
			applyForce.applyImpulse(vector.multiplyScalar(data?.forceAmount ?? 50), true);
		}
	});

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
		{#if hasPhysics}
			<T.Object3D position={[0, 4, 0]}>
				<CollisionGroups groups={[4]}>
					<Collider
						sensor
						shape={'cuboid'}
						args={[0.5, 4, 0.5]}
						type="dynamic"
						on:sensorenter={() => {
							levelDone();
							console.log('win');
						}}
					/>
				</CollisionGroups>
			</T.Object3D>
		{/if}

		<T.Mesh receiveShadow>
			<RoundedBoxGeometry args={[1, 1 * 2.02, 1]} radius={0.1} />
			<T.MeshStandardMaterial color={new THREE.Color(0x0ea5e9)} />
		</T.Mesh>
	{/if}
	{#if hasPhysics}
		<CollisionGroups groups={[2]}>
			<Collider
				shape={'cuboid'}
				args={[1, 1, 1]}
				type="dynamic"
				restitution={type == 'bounce' ? 2 : undefined}
				friction={type == 'slide' ? 0 : 10000}
			/>
		</CollisionGroups>
	{/if}

	{#if type == 'force' && hasPhysics}
		<T.Object3D position={[0, data.forceHeight ?? 5, 0]}>
			<Lines height={data.forceHeight} />
			<CollisionGroups groups={[type !== 'force' ? 2 : 4]}>
				<Collider
					shape={'cuboid'}
					args={[1 - 0.04, data.forceHeight ?? 5, 1 - 0.04]}
					type="dynamic"
					sensor={true}
					on:sensorenter={(test) => {
						applyForce = test.targetRigidBody;
					}}
					on:sensorexit={() => {
						applyForce = null;
					}}
				/>
			</CollisionGroups>
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
	{#if $page.state.gameState == 'edit' && $selectedPlatform == index}
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
