<script lang="ts">
	import { T } from '@threlte/core';
	import { useTexture, Billboard } from '@threlte/extras';

	let cloudTexture = useTexture('/cloud.png');
</script>

{#await cloudTexture then value}
	<Billboard {...$$restProps}>
		<T.Mesh rotation.z={Math.random() * Math.PI * 2}>
			<T.PlaneGeometry args={[1, 1]} />
			<T.MeshBasicMaterial
				map={value}
				transparent={true}
				opacity={0.5}
				depthWrite={false}
				color={0xffffff}
			/>
		</T.Mesh>
	</Billboard>
{/await}
