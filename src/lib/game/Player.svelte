<script lang="ts">
	import { Euler, Group, Vector3 } from 'three';
	import { T, useTask } from '@threlte/core';
	import { RigidBody, Collider, CollisionGroups } from '@threlte/rapier';
	import Controller from './CameraControls.svelte';

	import { RigidBody as RapierRigidBody } from '@dimforge/rapier3d-compat';
	import {
		currentLevel,
		showDebug,
		playing,
		playingTime,
		playLevel,
		canEdit,
		playerPosition,
	} from '../gamestate';
	import { replaceState } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import interact from 'interactjs';

	import material from './materials/player';

	export let position: [number, number, number] = [0, 0, 0];
	position[1] += 2;

	export let radius = 0.5;
	export let speed = 35;
	export let jumpForce = 25;

	export let linDrag = 0.95;
	export let angDrag = 0.99;

	let maxTimeAfterContact = 0.1;
	let maxTimeBeforeContact = 0.1;

	let nicerTimer = 0;
	let pressedJump = 0;

	let sphere: Group;
	let sphereRef: Group | undefined;
	let rigidBody: RapierRigidBody;

	let up = 0;

	const temp = new Vector3();

	let grounded = false;

	let playingLevel = $currentLevel;

	function calculateMovement() {
		return [leftMotion - rightMotion, up * jumpForce, forwardMotion - backwardMotion];
	}

	useTask((delta) => {
		$playingTime += delta;

		if ($page.state.gameState !== 'playing' && rigidBody) {
			rigidBody.setAngvel({ x: 0, y: 0, z: 0 }, true);
			rigidBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
			return;
		}

		if (grounded) {
			nicerTimer = maxTimeAfterContact;
		}

		pressedJump -= delta;
		nicerTimer -= delta;

		if (!rigidBody || !sphere) return;
		// get direction
		const velVec = temp.fromArray(calculateMovement());
		if (up > 0) {
			nicerTimer = 0;
		}
		up = 0;

		// sort rotate and multiply by speed
		velVec.applyEuler(new Euler().copy(sphere.rotation)).multiplyScalar(speed);

		const linVel = rigidBody.linvel();

		// slow down
		linVel.x *= linDrag;
		linVel.z *= linDrag;

		// set velocity
		rigidBody.setLinvel(linVel, true);

		// slow down rotation
		const angVel = rigidBody.angvel();
		angVel.x *= angDrag;
		angVel.y *= angDrag;
		angVel.z *= angDrag;
		rigidBody.setAngvel(angVel, true);

		rigidBody.applyImpulse(temp, true);

		// when body position changes update camera position
		const pos = rigidBody.translation();
		position = [pos.x, pos.y, pos.z];
		$playerPosition = position;

		// check if lost (fallen off)
		if (pos.y < -10) {
			die();
		}
	});

	function die() {
		if (isPlaying) playLevel($currentLevel);
	}

	function actualJump() {
		nicerTimer = 0;
		pressedJump = 0;

		up = 1;
	}

	function jump() {
		if (grounded || nicerTimer > 0) {
			actualJump();
		} else {
			pressedJump = maxTimeBeforeContact;
		}
	}

	let forwardMotion = 0;
	let backwardMotion = 0;
	let leftMotion = 0;
	let rightMotion = 0;

	function onKeyDown(e: KeyboardEvent) {
		if (!isPlaying) return;

		switch (e.key) {
			case 's':
				backwardMotion = 1;
				break;
			case 'w':
				forwardMotion = 1;
				break;
			case 'a':
				leftMotion = 1;
				break;
			case 'd':
				rightMotion = 1;
				break;
			case ' ':
				jump();
				break;

			case 'k':
				if ($canEdit) {
					replaceState('', {
						gameState: 'edit'
					});
				}
			default:
				break;
		}
	}

	function onKeyUp(e: KeyboardEvent) {
		if (!isPlaying) return;

		switch (e.key) {
			case 's':
				backwardMotion = 0;
				break;
			case 'w':
				forwardMotion = 0;
				break;
			case 'a':
				leftMotion = 0;
				break;
			case 'd':
				rightMotion = 0;
				break;
			case '1':
				$showDebug = !$showDebug;
				break;
			default:
				break;
		}
	}

	$: isPlaying = $page.state.gameState == 'playing' && $playing && ($playingTime > 0 || $canEdit);

	$: if (sphere) {
		sphereRef = sphere;
	}

	$: if (playingLevel != $currentLevel) {
		playingLevel = $currentLevel;
		if (rigidBody) {
			rigidBody.setTranslation({ x: 0, y: 5, z: 0 }, true);
			rigidBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
			rigidBody.setAngvel({ x: 0, y: 0, z: 0 }, true);
		}
	}

	$: if (pressedJump > 0 && grounded) {
		actualJump();
	}

	onMount(() => {
		interact(window.document.body).on('tap', function () {
			jump();
		});
	});
</script>

<svelte:window
	on:keydown|preventDefault={onKeyDown}
	on:keyup={onKeyUp}
/>

<T.PerspectiveCamera makeDefault fov={90} far={500}>
	<Controller bind:object={sphereRef} />
</T.PerspectiveCamera>

<T.Group bind:ref={sphere} {position} rotation.y={Math.PI}>
	<RigidBody bind:rigidBody linearDamping={0} gravityScale={5}>
		<CollisionGroups groups={[1, 2, 4]}>
			<Collider
				shape={'ball'}
				args={[radius + 0.02]}
				density={100}
				restitution={0.7}
				on:collisionenter={() => (grounded = true)}
				on:collisionexit={() => (grounded = false)}
			/>
		</CollisionGroups>
		<T.Mesh castShadow receiveShadow>
			<T.SphereGeometry args={[radius, 32, 32]} />
			<T is={material} metalness={1.0} roughness={0.0} />
		</T.Mesh>
	</RigidBody>
</T.Group>
