import * as THREE from 'three';

const material = new THREE.MeshStandardMaterial();
material.onBeforeCompile = (shader) => {
	const noiseFunction = `
//	Simplex 3D Noise 
//	by Ian McEwan, Ashima Arts
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //  x0 = x0 - 0. + 0.0 * C 
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1. + 3.0 * C.xxx;

// Permutations
  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients
// ( N*N points uniformly over a square, mapped onto an octahedron.)
  float n_ = 1.0/7.0; // N=7
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}

// Function to simulate rubber texture
vec3 rubberTexture(vec3 vPos) {
    float scale = 50.0; // Adjust for finer or coarser texture
    vec3 pos = vPos * scale;
    
    float n = snoise(pos);
    vec3 color = vec3(0.05, 0.05, 0.05); // Base color of the rubber, typically dark
    
    // Adding slight color variation
    color += n * 0.05;
    
    return color;
}

// Function to create a bumpiness effect
vec3 bumpiness(vec3 vPos) {
    float scale = 10.0; // Scale of the bumpiness
    float amp = 0.1;
    return vec3(snoise(vPos * scale) * amp, snoise(vPos * scale + vec3(10, 20, 30)) * amp, snoise(vPos * scale + vec3(30, 20, 10)) * amp); // Amplitude of the bumpiness
}`;

	shader.vertexShader = `varying vec3 vPos;\n${shader.vertexShader}`.replace(
		`#include <begin_vertex>`,
		`#include <begin_vertex>\nvPos = (modelMatrix * vec4(position, 1.0)).xyz;`
	);

	shader.fragmentShader = `varying vec3 vPos;\n${noiseFunction}\n${shader.fragmentShader}`;

	shader.fragmentShader = shader.fragmentShader.replace(
		'vec4 diffuseColor = vec4( diffuse, opacity );',
		`vec4 diffuseColor = vec4(diffuse * rubberTexture(vPos).rgb, opacity );`
	);
	// Modify the normal for bumpiness
	shader.fragmentShader = shader.fragmentShader.replace(
		`#include <normal_fragment_maps>`,
		`vec3 bump = bumpiness(vPos);
        normal = normalize(normal + bump);
        #include <normal_fragment_maps>`
	);

	console.log(shader.fragmentShader);

	// You can also adjust the material properties here if needed
	material.roughness = 0.6; // Adjust as needed
	material.bumpScale = 0.1; // Adjust as needed
};

export default material;
