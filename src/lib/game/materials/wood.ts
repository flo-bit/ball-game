import * as THREE from 'three';

const woodMaterial = new THREE.MeshStandardMaterial();
woodMaterial.onBeforeCompile = (shader) => {
	const noiseFunction = `
// Add your noise function here
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
#define sat(x)	clamp(x, 0., 1.)
#define S(a, b, c)	smoothstep(a, b, c)
#define S01(a)	S(0., 1., a)

float sum2(vec2 v) { return dot(v, vec2(1)); }

///////////////////////////////////////////////////////////////////////////////

float h31(vec3 p3) {
	p3 = fract(p3 * .1031);
	p3 += dot(p3, p3.yzx + 333.3456);
	return fract(sum2(p3.xy) * p3.z);
}

float h21(vec2 p) { return h31(p.xyx); }

float n31(vec3 p) {
	const vec3 s = vec3(7, 157, 113);

	// Thanks Shane - https://www.shadertoy.com/view/lstGRB
	vec3 ip = floor(p);
	p = fract(p);
	p = p * p * (3. - 2. * p);
	vec4 h = vec4(0, s.yz, sum2(s.yz)) + dot(ip, s);
	h = mix(fract(sin(h) * 43758.545), fract(sin(h + s.x) * 43758.545), p.x);
	h.xy = mix(h.xz, h.yw, p.y);
	return mix(h.x, h.y, p.z);
}

// roughness: (0.0, 1.0], default: 0.5
// Returns unsigned noise [0.0, 1.0]
float fbm(vec3 p, int octaves, float roughness) {
	float sum = 0.,
	      amp = 1.,
	      tot = 0.;
	roughness = sat(roughness);
	for (int i = 0; i < octaves; i++) {
		sum += amp * n31(p);
		tot += amp;
		amp *= roughness;
		p *= 2.;
	}
	return sum / tot;
}

vec3 randomPos(float seed) {
	vec4 s = vec4(seed, 0, 1, 2);
	return vec3(h21(s.xy), h21(s.xz), h21(s.xw)) * 1e2 + 1e2;
}

// Returns unsigned noise [0.0, 1.0]
float fbmDistorted(vec3 p) {
	p += (vec3(n31(p + randomPos(0.)), n31(p + randomPos(1.)), n31(p + randomPos(2.))) * 2. - 1.) * 1.12;
	return fbm(p, 8, .5);
}

// vec3: detail(/octaves), dimension(/inverse contrast), lacunarity
// Returns signed noise.
float musgraveFbm(vec3 p, float octaves, float dimension, float lacunarity) {
	float sum = 0.,
	      amp = 1.,
	      m = pow(lacunarity, -dimension);
	for (float i = 0.; i < octaves; i++) {
		float n = n31(p) * 2. - 1.;
		sum += n * amp;
		amp *= m;
		p *= lacunarity;
	}
	return sum;
}

// Wave noise along X axis.
vec3 waveFbmX(vec3 p) {
	float n = p.x * 20.;
	n += .4 * fbm(p * 3., 3, 3.);
	return vec3(sin(n) * .5 + .5, p.yz);
}

///////////////////////////////////////////////////////////////////////////////
// Math
float remap01(float f, float in1, float in2) { return sat((f - in1) / (in2 - in1)); }

///////////////////////////////////////////////////////////////////////////////
// Wood material.
vec3 matWood(vec3 p) {
	float n1 = fbmDistorted(p * vec3(7.8, 1.17, 1.17));
	n1 = mix(n1, 1., .2);
	float n2 = mix(musgraveFbm(vec3(n1 * 4.6), 8., 0., 2.5), n1, .85),
	      dirt = 1. - musgraveFbm(waveFbmX(p * vec3(.01, .15, .15)), 15., .26, 2.4) * .4;
	float grain = 1. - S(.2, 1., musgraveFbm(p * vec3(500, 6, 1), 2., 2., 2.5)) * .2;
	n2 *= dirt * grain;
    
    // The three vec3 values are the RGB wood colors - Tweak to suit.
	return mix(mix(vec3(.03, .012, .003), vec3(.25, .11, .04), remap01(n2, .19, .56)), vec3(.52, .32, .19), remap01(n2, .56, 1.));
}

// Function to create wood grain texture
vec3 woodGrain(vec3 vPos) {
    float scale = 20.0; // Adjust for the scale of the wood grain
    vec3 pos = vPos * scale;
    
    // Create the wood grain pattern
    float grain = sin(pos.x * 5.0 + snoise(pos * 1.0) * 2.0) * 0.5 + 0.5;
    
    // Color variation for the wood
    vec3 color = vec3(0.76, 0.49, 0.28); // Adjust for your desired wood color
    color *= grain; // Modulate color with the grain pattern
    
    return color;
}`;

	shader.vertexShader = `varying vec3 vPos;\n${shader.vertexShader}`.replace(
		`#include <begin_vertex>`,
		`#include <begin_vertex>\nvPos = (modelMatrix * vec4(position, 1.0)).xyz;`
	);

	shader.fragmentShader = `varying vec3 vPos;\n${noiseFunction}\n${shader.fragmentShader}`;

	shader.fragmentShader = shader.fragmentShader.replace(
		'vec4 diffuseColor = vec4( diffuse, opacity );',
		`vec4 diffuseColor = vec4(matWood(vPos), opacity);`
	);
};

// Adjusting the material properties
woodMaterial.roughness = 0.5; // Adjust as needed for the look of the wood
woodMaterial.bumpScale = 0.05; // Adjust as needed

export default woodMaterial;
