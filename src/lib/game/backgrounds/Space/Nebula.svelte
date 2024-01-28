<script lang="ts">
	import { T } from '@threlte/core';
	import { Billboard, useTexture } from '@threlte/extras';

	const map = useTexture('smoke.png');

	const blueColors = [0x34d399, 0x2dd4bf, 0x67e8f9, 0x0ea5e9, 0x60a5fa];
</script>

{#await map then value}
	{#each Array.from({ length: 20 }) as _, i}
		<Billboard {...$$restProps}>
			<T.Mesh
				position.z={-20 + Math.random() * 20}
				position.x={Math.random() * 40 - 10}
				position.y={Math.random() * 20 - 10}
				rotation.z={Math.random() * 4}
				scale={(Math.random() * 8 + 1) * 10}
			>
				<T.PlaneGeometry />
				<T.MeshBasicMaterial
					map={value}
					color={blueColors[Math.floor(Math.random() * blueColors.length)]}
					transparent={true}
					opacity={0.7}
					depthWrite={false}
				/>
			</T.Mesh>
		</Billboard>
	{/each}
{/await}
