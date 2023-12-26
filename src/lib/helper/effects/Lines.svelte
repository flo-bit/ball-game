<script>
	import { T, useTask } from '@threlte/core';
	import { MeshLineMaterial, MeshLineGeometry } from '@threlte/extras';
	import { Vector3, CatmullRomCurve3, Color } from 'three';

	// create a smooth curve from 4 points
	const curve = new CatmullRomCurve3([
		new Vector3(0.1, -1, 0),
		new Vector3(0, -0.5, 0.1),
		new Vector3(0.2, 0.5, 0),
		new Vector3(0, 1, 0.3)
	]);

	// convert curve to an array of 100 points
	const points = curve.getPoints(100);

	let width = 0.5;
	let dashOffset = 0;
	let color = new Color();
	const emerald = new Color('#10b981');
	const teal = new Color('#14b8a6');

    let color2 = new Color();
    const blue = new Color('#3b82f6');
    const cyan = new Color('#06b6d4');

	const maxWidth = 0.03;

	useTask((delta) => {
		// every frame we:
		// increase the dash offset
		dashOffset -= delta;
		// transition between two colors
		color.lerpColors(emerald, teal, Math.sin(dashOffset * 2) / 2 + 0.5);
        color2.lerpColors(blue, cyan, Math.sin(dashOffset * 2) / 2 + 0.5);
		// shrink and grow the line width
		width = Math.sin(dashOffset * 2) / 100 + 0.015;
	});

    export let height = 1;
</script>

<T.Mesh scale.y={height}>
	<MeshLineGeometry {points} />

	<MeshLineMaterial
		width={maxWidth - width}
		{color}
		dashArray={0.5}
		dashRatio={0.5}
		{dashOffset}
		transparent
	/>
</T.Mesh>

<T.Mesh scale.y={0.8 * height} position.x={0.5}>
	<MeshLineGeometry {points} />

	<MeshLineMaterial
		{width}
		color={color2}
		dashArray={0.5}
		dashRatio={0.5}
		dashOffset={dashOffset * 1.5 + 0.25}
		transparent
	/>
</T.Mesh>

<T.Mesh scale.y={0.9 * height} position.x={-0.6} rotation.y={3}>
	<MeshLineGeometry {points} />

	<MeshLineMaterial
		{width}
		{color}
		dashArray={0.5}
		dashRatio={0.5}
		dashOffset={dashOffset * 0.8 + 0.1}
		transparent
	/>
</T.Mesh>

<T.Mesh scale.y={0.9 * height} position.x={-0.6} rotation.y={3}>
	<MeshLineGeometry {points} />

	<MeshLineMaterial
		width={maxWidth - width}
		color={color2}
		dashArray={0.5}
		dashRatio={0.5}
		dashOffset={dashOffset * 2 + 0.1}
		transparent
	/>
</T.Mesh>

<T.Mesh scale.y={1.1 * height} position.x={0.5} position.z={0.7} rotation.y={2}>
	<MeshLineGeometry {points} />

	<MeshLineMaterial
		{width}
		{color}
		dashArray={0.5}
		dashRatio={0.5}
		dashOffset={dashOffset * 1.3 + 0.05}
		transparent
	/>
</T.Mesh>

<T.Mesh scale.y={0.95 * height} position.x={0.6} position.z={-0.4} rotation.y={1}>
	<MeshLineGeometry {points} />

	<MeshLineMaterial
		{width}
		color={color2}
		dashArray={0.5}
		dashRatio={0.5}
		dashOffset={dashOffset * 1.6 + 0.2}
		transparent
	/>
</T.Mesh>

<T.Mesh scale.y={0.95 * height} position.x={-0.8} position.z={-0.4} rotation.y={0}>
	<MeshLineGeometry {points} />

	<MeshLineMaterial
		{width}
		{color}
		dashArray={0.5}
		dashRatio={0.5}
		dashOffset={dashOffset + 0.15}
		transparent
	/>
</T.Mesh>

<T.Mesh scale.y={0.95 * height} position.x={-0.8} position.z={0.4} rotation.y={3}>
	<MeshLineGeometry {points} />

	<MeshLineMaterial
		{width}
		color={color2}
		dashArray={0.5}
		dashRatio={0.5}
		dashOffset={dashOffset * 0.7 + 0.1}
		transparent
	/>
</T.Mesh>

<T.Mesh scale.y={0.95 * height} position.x={0.6} position.z={-0.4} rotation.y={1}>
	<MeshLineGeometry {points} />

	<MeshLineMaterial
		{width}
		{color}
		dashArray={0.5}
		dashRatio={0.5}
		dashOffset={dashOffset * 0.8 + 0.05}
		transparent
	/>
</T.Mesh>

<T.Mesh scale.y={0.95 * height} position.x={0.6} position.z={-0.4} rotation.y={1}>
	<MeshLineGeometry {points} />

	<MeshLineMaterial
		width={maxWidth - width}
		color={color2}
		dashArray={0.5}
		dashRatio={0.5}
		dashOffset={dashOffset * 1.3 + 0.25}
		transparent
	/>
</T.Mesh>
