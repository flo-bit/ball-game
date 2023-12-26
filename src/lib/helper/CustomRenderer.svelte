<script lang="ts">
	import { useTask, useThrelte } from '@threlte/core';
	import { EffectComposer, EffectPass, RenderPass, DepthOfFieldEffect } from 'postprocessing';
	import { onMount } from 'svelte';

	const { scene, renderer, camera, size, autoRender, renderStage } = useThrelte();

	const composer = new EffectComposer(renderer);
	const setupEffectComposer = (camera: THREE.Camera) => {
		composer.removeAllPasses();
		composer.addPass(new RenderPass(scene, camera));

		const dofEffect = new DepthOfFieldEffect(camera, {
			focusDistance: 0.001,
			focalLength: 0.01,
			bokehScale: 10,
			height: 1080
		});

		composer.addPass(new EffectPass(camera, dofEffect));
	};

	$: setupEffectComposer($camera);
	$: composer.setSize($size.width, $size.height);

	onMount(() => {
		let before = autoRender.current;
		autoRender.set(false);
		return () => {
			autoRender.set(before);
		};
	});
	useTask(
		(delta) => {
			composer.render(delta);
		},
		{ stage: renderStage, autoInvalidate: false }
	);
</script>
