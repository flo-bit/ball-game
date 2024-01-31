<script lang="ts">
	import { T } from '@threlte/core';
	import { Instance, InstancedMesh, Sky } from '@threlte/extras';
	import { useTexture, Billboard } from '@threlte/extras';
	import { MathUtils } from 'three';
	import * as THREE from 'three';

	let maxDist = 1000;

	let positions: [number, number, number][] = [];

	for (let i = 0; i < 100; i++) {
		let x = Math.pow(MathUtils.randFloatSpread(1), 3) * maxDist;
		let y = Math.random() * 20 - 45;
		let z = Math.pow(MathUtils.randFloatSpread(1), 3) * maxDist;

		positions.push([x, y, z]);
	}
	let cloudTexture = useTexture('/cloud.png');

	let geometry = new THREE.PlaneGeometry(1, 1);
	let material = new THREE.MeshBasicMaterial({
		transparent: true,
		opacity: 0.5,
		depthWrite: false,
		color: 0xffffff,
	});
</script>

<Sky elevation={4} />

<!-- {#await cloudTexture then value}
	<InstancedMesh>
		<T.PlaneGeometry args={[1, 1]} />
		<T.MeshBasicMaterial
			map={value}
			transparent={true}
			opacity={0.5}
			depthWrite={false}
			color={0xffffff}
		/>

		{#each positions as position}
			<Billboard scale={[Math.random() * 40 + 50, 50, Math.random() * 40 + 50]} {position}>
				<Instance rotation.z={Math.random() * Math.PI * 2}></Instance>
			</Billboard>
		{/each}
	</InstancedMesh>
{/await} -->

{#await cloudTexture then value}
	{#each positions as position}
		<Billboard scale={[Math.random() * 40 + 50, 50, Math.random() * 40 + 50]} {position}>
			<T.Mesh rotation.z={Math.random() * Math.PI * 2}>
				<T is={geometry} />
				<T is={material} map={value} />
			</T.Mesh>
		</Billboard>
	{/each}
{/await}
