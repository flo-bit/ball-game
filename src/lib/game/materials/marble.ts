import * as THREE from 'three';

const material = new THREE.MeshStandardMaterial();
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

    // Modulate the color intensity based on the noise
    float vein = noise(warpedPos2 * warpFactor) * noise(warpedPos);

    float a = 1.0 - (sin(vein * 12.0) + 1.0) * 0.5;
    float diff = noise(vPos * warpFactor);
    diff = diff * noise(diff * vPos) * a;
    return vec3((1.0 - diff * 2.0));
}`;
	shader.vertexShader = `varying vec3 vPos;\n${shader.vertexShader}`.replace(
		`#include <begin_vertex>`,
		`#include <begin_vertex>\nvPos = (modelMatrix * vec4(position, 1.0)).xyz;`
	);

	shader.fragmentShader = `varying vec3 vPos;\n${noiseFunction}\n${shader.fragmentShader}`;

	shader.fragmentShader = shader.fragmentShader.replace(
		'vec4 diffuseColor = vec4( diffuse, opacity );',
		`vec4 diffuseColor = vec4(diffuse * marble(vPos), opacity );`
	);
};

export default material;
