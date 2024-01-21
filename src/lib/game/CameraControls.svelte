<script lang="ts">
	// mostly stolen from https://threlte.xyz/docs/examples/camera/thirdpersoncamera
	import { createEventDispatcher, onDestroy } from 'svelte';
	import { Camera, Vector2, Vector3, Quaternion, Group } from 'three';
	import { useThrelte, useParent, useTask } from '@threlte/core';

	const { invalidate, renderer } = useThrelte();

	export let object: Group | undefined;
	export let rotateSpeed = 0.8;

	export let idealOffset = { x: 0, y: 2, z: -3 };
	export let idealLookAt = { x: 0, y: 1, z: 5 };

	const currentPosition = new Vector3();
	const currentLookAt = new Vector3();

	const rotateDelta = new Vector2();

	const axis = new Vector3(0, 1, 0);
	const rotationQuat = new Quaternion();

	const camera = useParent();
	const dispatch = createEventDispatcher();

	const isCamera = (p: any): p is Camera => {
		return p.isCamera;
	};

	if (!isCamera($camera)) {
		throw new Error('Parent missing: <PointerLockControls> need to be a child of a <Camera>');
	}
	const domElement = renderer.domElement;

	if (!renderer) {
		throw new Error('Threlte Context missing: Is <PointerLockControls> a child of <Canvas>?');
	}

	let isLocked = document.pointerLockElement === domElement;

	export const lock = () => domElement.requestPointerLock();
	export const unlock = () => document.exitPointerLock();

	domElement.addEventListener('mousemove', onMouseMove);
	domElement.ownerDocument.addEventListener('pointerlockchange', onPointerlockChange);
	domElement.ownerDocument.addEventListener('pointerlockerror', onPointerlockError);

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

		console.log(movementX);
	}

	function onPointerlockError() {
		console.error('PointerLockControls: Unable to use Pointer Lock API');
	}

	useTask((delta) => {
		// the object's position is bound to the prop
		if (!object) return;

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

	function onKeyDown(event: KeyboardEvent) {
		switch (event.key) {
			case 'q':
				rotateCamera(-2 * rotateSpeed);
				break;
			case 'e':
				rotateCamera(2 * rotateSpeed);
				break;

			case 'l':
				lock();
				break;
			default:
				break;
		}
	}

	function onKeyUp(event: KeyboardEvent) {
		switch (event.key) {
			case 'q':
				rotateDelta.set(0, 0);
				break;
			case 'e':
				rotateDelta.set(0, 0);
				break;
			default:
				break;
		}
	}
</script>

<svelte:window
	on:keydown={onKeyDown}
	on:keyup={onKeyUp}
/>
	<!-- on:pointerdown={onPointerDown}
	on:pointerleave={onPointerUp}
	on:pointerup={onPointerUp}
	on:pointercancel={onPointerUp}
	on:pointermove={onPointerMove} -->