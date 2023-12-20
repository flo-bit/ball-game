<script lang="ts">
	// mostly stolen from https://threlte.xyz/docs/examples/camera/thirdpersoncamera
	import { createEventDispatcher, onDestroy } from 'svelte';
	import { Camera, Vector2, Vector3, Quaternion, Group, Euler } from 'three';
	import { useThrelte, useParent, useTask } from '@threlte/core';

	export let object: Group | undefined;
	export let rotateSpeed = 1.0;

	export let idealOffset = { x: 0, y: 2, z: -3 };
	export let idealLookAt = { x: 0, y: 1, z: 5 };

	const currentPosition = new Vector3();
	const currentLookAt = new Vector3();

	let isOrbiting = false;
	let pointerDown = false;

	const rotateStart = new Vector2();
	const rotateEnd = new Vector2();
	const rotateDelta = new Vector2();

	const axis = new Vector3(0, 1, 0);
	const rotationQuat = new Quaternion();

	const _euler = new Euler(0, 0, 0, 'YXZ');
	const _PI_2 = Math.PI / 2;

	const { renderer, invalidate } = useThrelte();

	const domElement = renderer.domElement;
	const camera = useParent();

	const dispatch = createEventDispatcher();

	const isCamera = (p: any): p is Camera => {
		return p.isCamera;
	};

	if (!isCamera($camera)) {
		throw new Error('Parent missing: <PointerLockControls> need to be a child of a <Camera>');
	}

	// domElement.addEventListener('pointerdown', onPointerDown);
	// domElement.addEventListener('pointermove', onPointerMove);
	// domElement.addEventListener('pointerleave', onPointerLeave);
	// domElement.addEventListener('pointerup', onPointerUp);

	// onDestroy(() => {
	// 	domElement.removeEventListener('pointerdown', onPointerDown);
	// 	domElement.removeEventListener('pointermove', onPointerMove);
	// 	domElement.removeEventListener('pointerleave', onPointerLeave);
	// 	domElement.removeEventListener('pointerup', onPointerUp);
	// });

	domElement.addEventListener('mousemove', onPointerMove);
	domElement.ownerDocument.addEventListener('pointerlockchange', onPointerlockChange);
	domElement.ownerDocument.addEventListener('pointerlockerror', onPointerlockError);
	onDestroy(() => {
		domElement.removeEventListener('mousemove', onPointerMove);
		domElement.ownerDocument.removeEventListener('pointerlockchange', onPointerlockChange);
		domElement.ownerDocument.removeEventListener('pointerlockerror', onPointerlockError);
	});

	// This is basically your update function
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

		rotateDelta.set(0, 0);
	});

	function onPointerMove(event: MouseEvent) {
		const { x, y } = event;
		//if(!isLocked) return;

		const { movementX, movementY } = event;
		if (!isOrbiting) {
			// calculate distance from init down
			const distCheck =
				Math.sqrt(Math.pow(x - rotateStart.x, 2) + Math.pow(y - rotateStart.y, 2)) > 10;
			if (distCheck) {
				isOrbiting = true;
			}
		}
		if (!isOrbiting) return;

		rotateDelta.set(movementX, movementY).multiplyScalar(rotateSpeed);
		//rotateDelta.subVectors(rotateEnd, rotateStart).multiplyScalar(rotateSpeed);
		//rotateStart.copy(rotateEnd);

		invalidate();
		dispatch('change');
	}
	function onPointerlockChange() {
		if (document.pointerLockElement === domElement) {
			dispatch('lock');
			isLocked = true;
		} else {
			dispatch('unlock');
			isLocked = false;
		}
	}

	function onPointerlockError() {
		console.error('PointerLockControls: Unable to use Pointer Lock API');
	}

	function vectorFromObject(vec: { x: number; y: number; z: number }) {
		if (!object) return new Vector3(0, 0, 0);

		const { x, y, z } = vec;
		const ideal = new Vector3(x, y, z);
		ideal.applyQuaternion(object.quaternion);
		ideal.add(new Vector3(object.position.x, object.position.y, object.position.z));
		return ideal;
	}
	export let minPolarAngle = 0; // radians
	export let maxPolarAngle = Math.PI; // radians
	export let pointerSpeed = 1.0;
	let isLocked = false;

	export const lock = () => domElement.requestPointerLock({
      unadjustedMovement: true
    });

	export const unlock = () => document.exitPointerLock();

	renderer.domElement.addEventListener('click', lock)

</script>
