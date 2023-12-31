<script lang="ts">
	import { Euler, Group, Vector3, MeshStandardMaterial } from 'three';
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
		playerPosition
	} from '../gamestate';
	import { replaceState } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import interact from 'interactjs';

	export let position: [number, number, number] = [0, 5, 0];
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

	const material = new MeshStandardMaterial();
	material.onBeforeCompile = (shader) => {
		const noiseFunction = `
float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

float noise(vec3 p){
	vec3 a = floor(p);
	vec3 d = p - a;
	d = d * d * (3.0 - 2.0 * d);

	vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
	vec4 k1 = perm(b.xyxy);
	vec4 k2 = perm(k1.xyxy + b.zzww);

	vec4 c = k2 + a.zzzz;
	vec4 k3 = perm(c);
	vec4 k4 = perm(c + 1.0);

	vec4 o1 = fract(k3 * (1.0 / 41.0));
	vec4 o2 = fract(k4 * (1.0 / 41.0));

	vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
	vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

	return o4.y * d.y + o4.x * (1.0 - d.y);
}
vec3 marble(vec3 vPos) {
    // More intricate warping for marble patterns
    float warpFactor = 2.0;
    vec3 warpedPos = vPos * warpFactor + noise(vPos * warpFactor * 0.5);
	vec3 warpedPos2 = warpedPos * warpFactor * 0.3 + noise(warpedPos * warpFactor * 0.5 + vec3(0, 2, 4)) + vPos;

    // Creating a rainbow-like color, warped by the noise
    vec3 color = 0.75 + 0.25 * cos(6.2831 * warpedPos2 * noise(warpedPos) + warpedPos + vec3(0, 2, 4));

	// make color more intense
	color = color * color * 0.6;

    // Modulate the color intensity based on the noise
    float vein = noise(warpedPos2 * warpFactor);
    color *= 0.7 + 0.2 * sin(vein * 12.0);

    return color;
}`;
		shader.vertexShader = `varying vec3 vPos;\n${shader.vertexShader}`.replace(
			`#include <begin_vertex>`,
			`#include <begin_vertex>\nvPos = transformed;`
		);

		shader.fragmentShader = `varying vec3 vPos;\n${noiseFunction}\n${shader.fragmentShader}`;

		shader.fragmentShader = shader.fragmentShader.replace(
			'vec4 diffuseColor = vec4( diffuse, opacity );',
			`vec4 diffuseColor = vec4(marble(vPos), opacity );`
		);
	};

	// Variables to store initial orientation
	let initialAlpha = 0,
		initialBeta = 0,
		initialGamma = 0;
	let isCalibrated = false;

	const minOrientationThreshold = 3;
	const maxOrientationThreshold = 10;

	// Function to handle device orientation event
	function handleOrientation(event: DeviceOrientationEvent) {
		if (!isCalibrated) {
			// Calibrate the initial orientation
			initialAlpha = event.alpha ?? 0;
			initialBeta = event.beta ?? 0;
			initialGamma = event.gamma ?? 0;
			isCalibrated = true;
		} else {
			// Calculate relative orientation
			const relativeAlpha = (event.alpha ?? 0) - initialAlpha;
			const relativeBeta = (event.beta ?? 0) - initialBeta;
			const relativeGamma = (event.gamma ?? 0) - initialGamma;

			// Map the relative orientation to game controls
			// Adjust these thresholds and mappings as needed for your game
			if (relativeBeta < -minOrientationThreshold) {
				forwardMotion =
					(Math.abs(relativeBeta) - minOrientationThreshold) /
					(maxOrientationThreshold - minOrientationThreshold);
			} else {
				forwardMotion = 0;
			}
			forwardMotion = Math.min(1, forwardMotion);

			if (relativeBeta > minOrientationThreshold) {
				backwardMotion =
					(Math.abs(relativeBeta) - minOrientationThreshold) /
					(maxOrientationThreshold - minOrientationThreshold);
			} else {
				backwardMotion = 0;
			}
			backwardMotion = Math.min(1, backwardMotion);

			if (relativeGamma > minOrientationThreshold) {
				rightMotion =
					(Math.abs(relativeGamma) - minOrientationThreshold) /
					(maxOrientationThreshold - minOrientationThreshold);
			} else {
				rightMotion = 0;
			}
			rightMotion = Math.min(1, rightMotion);

			if (relativeGamma < -minOrientationThreshold) {
				leftMotion =
					(Math.abs(relativeGamma) - minOrientationThreshold) /
					(maxOrientationThreshold - minOrientationThreshold);
			} else {
				leftMotion = 0;
			}
			leftMotion = Math.min(1, leftMotion);
		}
	}

	$: isPlaying = $page.state.gameState == 'playing' && $playing && ($playingTime > 0 || $canEdit);

	$: if (sphere) {
		sphereRef = sphere;
	}

	$: if (playingLevel != $currentLevel) {
		//isCalibrated = false;
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
	on:deviceorientation={handleOrientation}
/>

<T.PerspectiveCamera makeDefault fov={90}>
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
