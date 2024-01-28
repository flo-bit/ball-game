<script lang="ts">
	import { Euler, Group, Vector3 } from 'three';
	import { T, useTask, useThrelte } from '@threlte/core';
	import { RigidBody, Collider, CollisionGroups } from '@threlte/rapier';
	import Controller from './CameraControls.svelte';

	import { RigidBody as RapierRigidBody } from '@dimforge/rapier3d-compat';
	import {
		currentLevel,
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
	import { Audio } from '@threlte/extras';

	const { renderer } = useThrelte();

	let position: [number, number, number] = [0, 0, 0];
	position[1] += 2;

	let radius = 0.5;
	let speed = 35;
	let jumpForce = 25;

	let airDrag = 0.98;
	let groundDrag = 0.96;

	let airAcceleration = 0.5;
	let groundAcceleration = 1;

	let angDrag = 0.99;

	let maxTimeAfterContact = 0.1;
	let maxTimeBeforeContact = 0.1;

	let nicerTimer = 0;
	let pressedJump = 0;

	let sphere: Group;
	let sphereRef: Group | undefined;
	let rigidBody: RapierRigidBody;

	let up = 0;

	let grounded = false;

	let playingLevel = $currentLevel;

	const temp = new Vector3();
	const domElement = renderer.domElement;

	const lock = () => domElement.requestPointerLock();

	$: isPlaying = $page.state.gameState == 'playing' && $playing && ($playingTime > 0 || $canEdit);

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
		let drag = grounded ? groundDrag : airDrag;
		linVel.x *= drag;
		linVel.z *= drag;

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

	function calculateMovement() {
		let acceleration = grounded ? groundAcceleration : airAcceleration;
		return [(leftMotion - rightMotion) * acceleration, up * jumpForce, (forwardMotion - backwardMotion) * acceleration];
	}

	function die() {
		if (isPlaying) {
			playLevel($currentLevel);
		}
	}

	function actualJump() {
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
			default:
				break;
		}
	}

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

	function hitGround() {
		grounded = true;

		if(hitSound) hitSound.play();
	}

	function leaveGround() {
		grounded = false;
	}

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
	<RigidBody bind:rigidBody linearDamping={0} gravityScale={5}>
		<CollisionGroups groups={[1, 2, 4]}>
			<Collider
				shape={'ball'}
				args={[radius + 0.02]}
				density={100}
				restitution={0.7}
				on:collisionenter={hitGround}
				on:collisionexit={leaveGround}
			/>
		</CollisionGroups>
		<T.Mesh castShadow receiveShadow>
			<T.SphereGeometry args={[radius, 32, 32]} />
			<T is={material} metalness={1.0} roughness={0.0} />
		</T.Mesh>
	</RigidBody>
</T.Group>
