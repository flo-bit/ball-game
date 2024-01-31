<script lang="ts">
	import { onMount } from 'svelte';
	import { Euler, Group, Vector3 } from 'three';
	import { T, useTask, useThrelte } from '@threlte/core';
	import { Audio } from '@threlte/extras';
	import { RigidBody, Collider, CollisionGroups } from '@threlte/rapier';
	import { RigidBody as RapierRigidBody } from '@dimforge/rapier3d-compat';
	import interact from 'interactjs';

	import material from './materials/player';
	import Controller from './CameraControls.svelte';
	import {
		currentLevel,
		playingTime,
		playLevel,
		playerPosition,
		joystickPosition,
		jumpPressed,
		gameState
	} from '$lib/gamestate';

	const { renderer } = useThrelte();

	let position: [number, number, number] = [0, 0, 0];
	position[1] += 2;

	let radius = 0.5;
	let speed = 35;
	let jumpForce = 35;

	let airAcceleration = 0.5;
	let groundAcceleration = 1;

	let sphere: Group;
	let sphereRef: Group | undefined;
	let rigidBody: RapierRigidBody;

	let maxTimeAfterContact = 0.1;
	let maxTimeBeforeContact = 0.1;

	let nicerTimer = 0;
	let pressedJump = 0;

	let up = 0;

	let grounded = false;

	const temp = new Vector3();
	const domElement = renderer.domElement;

	let forwardMotion = 0;
	let backwardMotion = 0;
	let leftMotion = 0;
	let rightMotion = 0;

	onMount(() => {
		interact(window.document.body).on('tap', function () {
			jump();
		});
	});
	

	const lock = () => {
		if(domElement.requestPointerLock) domElement.requestPointerLock();
	}

	$: isPlaying = $gameState == 'playing' && $playingTime >= 0;

	function calculateMovement() {
		let acceleration = grounded ? groundAcceleration : airAcceleration;
		let leftRight = (leftMotion - rightMotion) || -$joystickPosition[0];
		let forwardBackward = (forwardMotion - backwardMotion) || -$joystickPosition[1];

		return [leftRight * acceleration, up * jumpForce, forwardBackward * acceleration];
	}

	function die() {
		if (isPlaying) {
			playLevel($currentLevel);
		}
	}

	function actualJump() {
		if(!isPlaying) return;

		nicerTimer = 0;
		pressedJump = 0;

		up = 1;

		if(jumpSound) jumpSound.play();
	}

	function jump() {
		if (grounded || nicerTimer > 0) {
			actualJump();
		} else {
			pressedJump = maxTimeBeforeContact;
		}
	}

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
			default:
				break;
		}
	}

	function hitGround() {
		grounded = true;

		if(hitSound) hitSound.play();
	}

	function leaveGround() {
		grounded = false;
	}

	$: if (sphere) {
		sphereRef = sphere;
	}

	$: if (pressedJump > 0 && grounded) {
		actualJump();
	}

	useTask((delta) => {
		let lastPlayingTime = $playingTime;
		$playingTime += delta;

		if(lastPlayingTime < 0 && Math.floor($playingTime) != Math.floor(lastPlayingTime)) {
			lock();

			if($playingTime < -1.5) {
				readySound.play();
			} else if($playingTime < -0.5) {
				setSound.play();
			} else if($playingTime < 0.5) {
				goSound.play();
			}
		}

		if($jumpPressed) {
			jump();
			$jumpPressed = false;
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

	let jumpSound: Audio;
	let hitSound: Audio;

	let readySound: Audio;
	let setSound: Audio;
	let goSound: Audio;
</script>

<svelte:window
	on:keydown|preventDefault={onKeyDown}
	on:keyup={onKeyUp}
/>

<Audio src="/audio/jump2.ogg" bind:this={jumpSound}/>
<Audio src="/audio/hit.ogg" bind:this={hitSound}/>

<Audio src="/audio/ready.ogg" bind:this={readySound}/>
<Audio src="/audio/set.ogg" bind:this={setSound}/>
<Audio src="/audio/go.ogg" bind:this={goSound}/>

<T.PerspectiveCamera makeDefault fov={90} far={500}>
	<Controller bind:object={sphereRef} />
</T.PerspectiveCamera>

<T.Group bind:ref={sphere} {position} rotation.y={Math.PI}>
	<RigidBody bind:rigidBody linearDamping={2} angularDamping={1} gravityScale={5}>
		<CollisionGroups groups={[1, 2, 4]}>
			<Collider
				shape={'ball'}
				args={[radius + 0.02]}
				density={100}
				restitution={0.7}
				on:collisionenter={hitGround}
				on:collisionexit={leaveGround}
				friction={10}
			/>
		</CollisionGroups>
		<T.Mesh castShadow receiveShadow>
			<T.SphereGeometry args={[radius, 32, 32]} />
			<T is={material} metalness={1.0} roughness={0.0} />
		</T.Mesh>
	</RigidBody>
</T.Group>
