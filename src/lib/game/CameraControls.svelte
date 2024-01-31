<script lang="ts">
	// mostly stolen from https://threlte.xyz/docs/examples/camera/thirdpersoncamera
	import { createEventDispatcher } from 'svelte';
	import { Vector2, Vector3, Quaternion, Group } from 'three';
	import { useThrelte, useParent, useTask } from '@threlte/core';

	const { renderer } = useThrelte();

	import { rotateX } from '../gamestate';

	export let object: Group | undefined;
	export let rotateSpeed = 0.65;

	export let idealOffset = { x: 0, y: 2, z: -3 };
	export let idealLookAt = { x: 0, y: 1, z: 5 };

	const currentPosition = new Vector3();
	const currentLookAt = new Vector3();

	const rotateDelta = new Vector2();

	const axis = new Vector3(0, 1, 0);
	const rotationQuat = new Quaternion();

	const camera = useParent();
	const dispatch = createEventDispatcher();

	const domElement = renderer.domElement;

	let isLocked = document.pointerLockElement === domElement;

	domElement.addEventListener('mousemove', onMouseMove);
	domElement.ownerDocument.addEventListener('pointerlockchange', onPointerlockChange);
	domElement.ownerDocument.addEventListener('pointerlockerror', onPointerlockChange);

	function onPointerlockChange() {
		if (document.pointerLockElement === domElement) {
			dispatch('lock');
			isLocked = true;
		} else {
			dispatch('unlock');
			isLocked = false;
		}
	}

	function onMouseMove(event: MouseEvent) {
		const { movementX } = event;
		if (!isLocked) return;
		if (!$camera) return;

		rotateCamera(movementX * rotateSpeed);
	}

	function vectorFromObject(vec: { x: number; y: number; z: number }) {
		if (!object) return new Vector3(0, 0, 0);

		const { x, y, z } = vec;
		const ideal = new Vector3(x, y, z);
		ideal.applyQuaternion(object.quaternion);
		ideal.add(new Vector3(object.position.x, object.position.y, object.position.z));
		return ideal;
	}

	function rotateCamera(angle: number) {
		rotateDelta.x = angle;
	}

	useTask((delta) => {
		// the object's position is bound to the prop
		if (!object) return;

		if ($rotateX) {
			rotateCamera($rotateX * rotateSpeed);
		}

		// camera is based on character so we rotation character first
		rotationQuat.setFromAxisAngle(axis, -rotateDelta.x * rotateSpeed * delta);
		object.quaternion.multiply(rotationQuat);

		// then we calculate our ideal's
		const offset = vectorFromObject(idealOffset);
		const lookAt = vectorFromObject(idealLookAt);

		// and how far we should move towards them
		const t = 1.0 - Math.pow(0.001, delta);
		currentPosition.lerp(offset, t);
		currentLookAt.lerp(lookAt, t);

		// then finally set the camera
		if ($camera) {
			$camera.position.copy(currentPosition);
			$camera.lookAt(currentLookAt);
		}

		rotateDelta.x = 0;
	});
</script>

<svelte:window
	on:click={() => {
		if (domElement) {
			domElement.requestPointerLock();
		}
	}}
/>
