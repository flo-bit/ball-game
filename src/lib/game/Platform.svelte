<script lang="ts">
	import * as THREE from 'three';
	import { T, useTask } from '@threlte/core';
	import { RoundedBoxGeometry } from '@threlte/extras';
	import { Collider, CollisionGroups } from '@threlte/rapier';
	import {
		currentLevel,
		gameState,
		highscores,
		playingTime,
		showNewHighscore
	} from '$lib/gamestate';

	import { interactivity } from '@threlte/extras';
	import Lines from '$lib/helper/effects/Lines.svelte';

	import type { RigidBody } from '@dimforge/rapier3d-compat';
	import type { PlatformType } from '$lib/types';
	interactivity();

	export let scale: [number, number, number] = [1, 1, 1];
	export let position: [number, number, number] = [0, 0, 0];
	export let rotation: [number, number, number] | [number, number, number, THREE.EulerOrder] = [
		0, 0, 0
	];

	let colors: Record<PlatformType, THREE.Color | string> = {
		start: new THREE.Color(0xd97706),
		win: new THREE.Color(0x7dd3fc),
		normal: new THREE.Color(0xfafaf9),
		force: new THREE.Color(0x10b981),
		bounce: new THREE.Color(0x7c3aed),
		slide: new THREE.Color(0xf59e0b)
	};

	export let type: PlatformType = 'normal';

	let ref: THREE.Object3D;

	export const unlock = () => document.exitPointerLock();

	function levelDone() {
		let time = $playingTime;

		$showNewHighscore = false;

		if (!$highscores[$currentLevel] || $highscores[$currentLevel] > time) {
			$highscores[$currentLevel] = time;
			$showNewHighscore = true;
		}

		$gameState = 'won';

		unlock();
	}

	export let hasPhysics = true;

	export let data: {
		forceAmount?: number;
		forceHeight?: number;
	} = {
		forceAmount: 50,
		forceHeight: 10
	};

	let playerRigidBody: RigidBody | null = null;

	const vector = new THREE.Vector3(0, 1, 0);
	const euler = new THREE.Euler(0, 0, 0, 'XYZ');

	const { stop, start } = useTask(() => {
		if (playerRigidBody) {
			vector.set(0, 1, 0);
			// rotate using rotation
			euler.set(rotation[0], rotation[1], rotation[2]);
			vector.applyEuler(euler);
			playerRigidBody.applyImpulse(vector.multiplyScalar(data?.forceAmount ?? 0), true);
		}
	});

	$: if (playerRigidBody) {
		start();
	} else {
		stop();
	}

	$: color = type ? colors[type] : colors['normal'];
</script>

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
				restitution={type == 'bounce' ? 4 : undefined}
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
					on:sensorenter={(player) => {
						playerRigidBody = player.targetRigidBody;
					}}
					on:sensorexit={() => {
						playerRigidBody = null;
					}}
				/>
			</CollisionGroups>
		</T.Object3D>
	{/if}
	<T.Mesh receiveShadow castShadow>
		<RoundedBoxGeometry args={[2, 2, 2]} radius={0.1} />
		<T.MeshStandardMaterial {color} roughness={0.5} />
	</T.Mesh>
</T.Object3D>
