// Earth-616's worlds and their 3D models, arranged around Earth-616 in the one big universe. Imported by index.html.
import * as THREE from 'three';

const D2R = Math.PI / 180;
const polar = (r, deg, y = 0) => new THREE.Vector3(Math.cos(deg * D2R) * r, y, Math.sin(deg * D2R) * r);
const V = (x, y, z) => new THREE.Vector3(x, y, z);

// ---------- layout around Earth-616 (local coordinates; +x points away from Loki's tree) ----------
const REALM_Y = 150, REALM_R = 80, ASGARD_Y = 205;
const CLUSTERS = { kree: [175, -62], fornax: [195, 0], andromeda: [175, 62] }; // [distance, angle]
const DEEP_R = 270, DEEP_SPAN = 230;

// ---------- shaders shared by the models (each has an `o` uniform so reality focus can fade it) ----------
const shader = (time, uniforms, frag, opts = {}) => new THREE.ShaderMaterial({
  uniforms: { time, o: { value: 1 }, ...uniforms },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }',
  fragmentShader: frag, transparent: true, depthWrite: false, side: THREE.DoubleSide, ...opts
});
const waterfallMat = time => shader(time, {}, `uniform float time, o; varying vec2 vUv;
  void main(){ float n = fract(sin(floor(vUv.x * 260.) * 43.7585) * 4375.85);
    float flow = fract(vUv.y * 2.5 + time * (0.45 + n * 0.3) + n);
    float streak = smoothstep(0., .55, flow) * (.45 + .55 * n);
    float a = streak * pow(vUv.y, 2.2) * .5 * o;
    gl_FragColor = vec4(mix(vec3(.35, .6, .95), vec3(.85, .93, 1.), streak) * .8, a); }`);
const rainbowMat = time => shader(time, {}, `uniform float time, o; varying vec2 vUv;
  vec3 hue(float h){ return clamp(abs(mod(h * 6. + vec3(0., 4., 2.), 6.) - 3.) - 1., 0., 1.); }
  void main(){ gl_FragColor = vec4(hue(vUv.x * 1.5 - time * .25) * 1.6, .9 * o); }`, { blending: THREE.AdditiveBlending });
const swirlMat = (time, color) => shader(time, { c: { value: new THREE.Color(color) } }, `uniform float time, o; uniform vec3 c; varying vec2 vUv;
  void main(){ vec2 p = vUv - .5; float r = length(p) * 2., a = atan(p.y, p.x);
    float sw = sin(a * 5. + r * 14. - time * 3.) * .5 + .5;
    gl_FragColor = vec4(mix(c, vec3(1.), (1. - r) * .7), smoothstep(1., .15, r) * (.3 + .7 * sw) * o); }`, { blending: THREE.AdditiveBlending });

function roughen(geo, amount, freq = 5) { // deterministic rocky surface, seam-safe because it depends only on position
  const p = geo.attributes.position, v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const n = Math.sin(v.x * freq) * Math.sin(v.y * freq * 1.3) * Math.sin(v.z * freq * 1.1) + Math.sin(v.x * freq * 3.1 + v.z * 2.3) * 0.35;
    v.multiplyScalar(1 + n * amount); p.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals(); return geo;
}

// ---------- hand-built models: each returns { obj, update(dt) } sized to radius s ----------
function asgard(s, k) {
  const g = new THREE.Group();
  const rock = new THREE.MeshStandardMaterial({ map: k.TEX.rock, color: '#8c7b68', roughness: 1 });
  const land = new THREE.MeshStandardMaterial({ map: k.TEX.day, color: '#d8ecb8', roughness: 0.85 });
  g.add(new THREE.Mesh(new THREE.CylinderGeometry(s, s * 0.97, s * 0.1, 128), [rock, land, rock]));
  const under = new THREE.Mesh(roughen(new THREE.ConeGeometry(s * 0.97, s * 1.2, 96, 12), 0.08, 3), rock);
  under.rotation.x = Math.PI; under.position.y = -s * 0.65; g.add(under);
  const falls = new THREE.Mesh(new THREE.CylinderGeometry(s * 1.004, s * 1.12, s * 0.55, 160, 1, true), waterfallMat(k.time));
  falls.position.y = -s * 0.3; g.add(falls);
  const mist = k.sprite('#cfe6ff', s * 2.6, 0.08); mist.position.y = -s * 0.9; g.add(mist);
  const gold = new THREE.MeshStandardMaterial({ color: '#f2c45a', metalness: 0.9, roughness: 0.28, emissive: '#7a5210', emissiveIntensity: 0.55 });
  const palace = new THREE.Mesh(new THREE.ConeGeometry(s * 0.07, s * 0.6, 8), gold); palace.position.y = s * 0.35; g.add(palace);
  for (let i = 0; i < 18; i++) { // Odin's palace spires and the golden city around it
    const h = s * (0.1 + ((i * 37) % 11) / 40), r = s * (0.09 + (i % 3) * 0.06);
    const spire = new THREE.Mesh(new THREE.ConeGeometry(s * 0.025, h, 6), gold);
    spire.position.copy(polar(r, i * 20 + (i % 2) * 9, s * 0.05 + h / 2)); g.add(spire);
  }
  const bridge = new THREE.Mesh(new THREE.BoxGeometry(s * 1.15, s * 0.012, s * 0.03), rainbowMat(k.time));
  bridge.position.set(s * 0.72, s * 0.06, 0); g.add(bridge);
  const observatory = new THREE.Mesh(new THREE.SphereGeometry(s * 0.07, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), gold);
  observatory.position.set(s * 1.3, s * 0.06, 0); g.add(observatory);
  g.rotation.set(0.35, 0, 0.12);
  return { obj: g };
}
function nidavellir(s, k) {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(k.sphereGeo, new THREE.MeshBasicMaterial({ color: '#eaf6ff' }))).children[0].scale.setScalar(s * 0.16);
  g.add(k.sprite('#9fd4ff', s * 2.2, 0.95), k.sprite('#ffffff', s * 0.8, 1));
  const metal = new THREE.MeshStandardMaterial({ color: '#5a6270', metalness: 0.95, roughness: 0.35, emissive: '#1a2a3a', emissiveIntensity: 0.4 });
  const hot = new THREE.MeshBasicMaterial({ color: '#bfe3ff' });
  const rings = [0.62, 0.8, 1].map((r, i) => {
    const ring = new THREE.Group();
    ring.add(new THREE.Mesh(new THREE.TorusGeometry(s * r, s * 0.045, 6, 128), metal));
    ring.add(new THREE.Mesh(new THREE.TorusGeometry(s * (r - 0.05), s * 0.008, 4, 128), hot)); // glowing inner edge
    for (let j = 0; j < 12; j++) { // forge plates
      const plate = new THREE.Mesh(new THREE.BoxGeometry(s * 0.12, s * 0.06, s * 0.14), metal);
      const a = j * 30 * D2R; // torus lies in its local XY plane
      plate.position.set(Math.cos(a) * s * r, Math.sin(a) * s * r, 0);
      plate.lookAt(0, 0, 0); ring.add(plate);
    }
    ring.rotation.set(Math.PI / 2 + i * 0.5, i * 0.9, 0); g.add(ring); return ring;
  });
  return { obj: g, update: dt => rings.forEach((r, i) => { r.rotation.z += dt * (0.12 + i * 0.07) * (i % 2 ? -1 : 1); }) };
}
function muspelheim(s, k) {
  const g = new THREE.Group(), lava = k.tex('venus_surface');
  const body = new THREE.Mesh(k.sphereGeo, new THREE.MeshStandardMaterial({ map: lava, color: '#3a1a10', emissiveMap: lava, emissive: '#ff3a0a', emissiveIntensity: 1.5, roughness: 0.9 }));
  body.scale.setScalar(s); g.add(body);
  const atmo = new THREE.Mesh(k.sphereGeo, k.atmoMat('#ff5a1a')); atmo.scale.setScalar(s * 1.12); g.add(atmo);
  g.add(k.sprite('#ff4a10', s * 3.4, 0.35));
  return { obj: g, update: dt => { body.rotation.y += dt * 0.05; } };
}
function knowhere(s, k) {
  const g = new THREE.Group(), bone = new THREE.MeshStandardMaterial({ map: k.TEX.rock, color: '#c9905a', roughness: 1 });
  const skull = new THREE.Mesh(roughen(new THREE.SphereGeometry(1, 96, 64), 0.05, 4), bone); skull.scale.set(s * 0.85, s, s * 0.92); g.add(skull);
  const jaw = new THREE.Mesh(roughen(new THREE.SphereGeometry(1, 64, 48), 0.06, 5), bone); jaw.scale.set(s * 0.58, s * 0.42, s * 0.6); jaw.position.set(0, -s * 0.7, s * 0.28); g.add(jaw);
  const brow = new THREE.Mesh(new THREE.CylinderGeometry(s * 0.1, s * 0.1, s * 1.05, 16), bone); brow.rotation.z = Math.PI / 2; brow.position.set(0, s * 0.22, s * 0.78); g.add(brow);
  const dark = new THREE.MeshBasicMaterial({ color: '#050302' });
  [-1, 1].forEach(x => { const eye = new THREE.Mesh(k.sphereGeo, dark); eye.scale.set(s * 0.17, s * 0.13, s * 0.1); eye.position.set(x * s * 0.3, s * 0.02, s * 0.84); g.add(eye); });
  const n = 420, pos = new Float32Array(n * 3); // mining-colony lights on the face
  for (let i = 0; i < n; i++) {
    const v = V(Math.random() - 0.5, Math.random() - 0.6, Math.random() * 0.8 + 0.2).normalize();
    pos.set([v.x * s * 0.87, v.y * s * 1.02, v.z * s * 0.95], i * 3);
  }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.add(new THREE.Points(geo, new THREE.PointsMaterial({ size: s * 0.05, color: '#ffb066', map: k.glow, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })));
  g.rotation.y = Math.PI / 2; // face looks outward, away from Loki's tree
  return { obj: g };
}
function sakaar(s, k) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(k.sphereGeo, new THREE.MeshStandardMaterial({ map: k.tex('venus_atmosphere'), color: '#e8b06a', roughness: 1 }));
  body.scale.setScalar(s); g.add(body);
  const portals = [];
  const portal = (r, at, color) => {
    const p = new THREE.Group();
    p.add(new THREE.Mesh(new THREE.TorusGeometry(r, r * 0.08, 8, 64), new THREE.MeshBasicMaterial({ color })));
    p.add(new THREE.Mesh(new THREE.CircleGeometry(r * 0.95, 64), swirlMat(k.time, color)));
    p.position.copy(at); p.lookAt(0, 0, 0); g.add(p); portals.push(p);
  };
  portal(s * 0.75, V(0, s * 2.1, 0), '#ff7a3a'); // the Devil's Anus
  for (let i = 0; i < 6; i++) portal(s * 0.28, V(Math.cos(i) * s * 1.7, Math.sin(i * 2.3) * s * 0.8, Math.sin(i) * s * 1.7), i % 2 ? '#b07aff' : '#5ee6ff');
  return { obj: g, update: dt => { body.rotation.y += dt * 0.04; portals.forEach((p, i) => p.children[1].rotateZ(dt * (0.6 + i * 0.1))); } };
}
function titan(s, k) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(k.sphereGeo, new THREE.MeshStandardMaterial({ map: k.tex('mars'), color: '#d08a5a', roughness: 1 }));
  body.scale.setScalar(s); g.add(body);
  const n = 260, chunks = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 0), new THREE.MeshStandardMaterial({ map: k.TEX.rock, color: '#9a7a62', roughness: 1 }), n);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
  for (let i = 0; i < n; i++) { // the shattered moon, now a debris ring
    const r = s * (1.5 + Math.random() * 0.7), a = Math.random() * Math.PI * 2, size = s * (0.02 + Math.random() ** 3 * 0.12);
    q.setFromEuler(e.set(Math.random() * 3, Math.random() * 3, 0));
    chunks.setMatrixAt(i, m.compose(V(Math.cos(a) * r, (Math.random() - 0.5) * s * 0.12, Math.sin(a) * r), q, V(size, size, size)));
  }
  const ring = new THREE.Group(); ring.add(chunks); ring.rotation.set(0.35, 0, 0.15); g.add(ring);
  return { obj: g, update: dt => { body.rotation.y += dt * 0.03; chunks.rotation.y += dt * 0.05; } };
}
function ego(s, k) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(k.sphereGeo, new THREE.MeshStandardMaterial({ map: k.TEX.day, color: '#c9a0ff', roughness: 0.8, emissive: '#2a1a5a', emissiveIntensity: 0.4 }));
  body.scale.setScalar(s); g.add(body);
  const atmo = new THREE.Mesh(k.sphereGeo, k.atmoMat('#8fb8ff')); atmo.scale.setScalar(s * 1.14); g.add(atmo);
  for (let i = 0; i < 7; i++) { // Ego's blue light threading round the planet
    const pts = Array.from({ length: 9 }, (_, j) => { const a = j * 0.45 + i, b = i * 0.9 + j * 0.2; return V(Math.cos(a) * Math.cos(b), Math.sin(b), Math.sin(a) * Math.cos(b)).multiplyScalar(s * 1.05); });
    g.add(k.tube(pts, s * 0.02, k.flowMat('#8fd0ff', 0.9, 0.4), 60));
  }
  g.add(k.sprite('#9a7aff', s * 3, 0.3));
  return { obj: g, update: dt => { body.rotation.y += dt * 0.04; } };
}
const BUILT = { asgard, nidavellir, muspelheim, knowhere, sakaar, titan, ego };

function texturedPlanet(model, tint, s, k) {
  const g = new THREE.Group(), color = new THREE.Color(tint);
  const map = model === 'earth' ? k.TEX.day : model === 'rock' ? k.TEX.rock : k.tex(model);
  const body = new THREE.Mesh(k.sphereGeo, new THREE.MeshStandardMaterial({ map, color, roughness: 0.95 }));
  body.scale.setScalar(s); body.rotation.z = 0.3; g.add(body);
  if (model === 'earth') {
    const cl = new THREE.Mesh(k.sphereGeo, new THREE.MeshLambertMaterial({ map: k.TEX.clouds, transparent: true, opacity: 0.7, depthWrite: false }));
    cl.scale.setScalar(s * 1.015); g.add(cl);
    const atmo = new THREE.Mesh(k.sphereGeo, k.atmoMat(new THREE.Color('#6fb4ff').lerp(color, 0.5))); atmo.scale.setScalar(s * 1.09); g.add(atmo);
  }
  return { obj: g, update: dt => { body.rotation.y += dt * 0.05; } };
}

async function swapInLicensedModel(holder, id, s) { // assets/models/<id>.glb replaces the hand-built model
  try {
    const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
    const gltf = await new GLTFLoader().loadAsync(`assets/models/${id}.glb`);
    const box = new THREE.Box3().setFromObject(gltf.scene), size = box.getSize(new THREE.Vector3()).length() || 1;
    gltf.scene.scale.setScalar((s * 2.2) / size);
    gltf.scene.position.sub(box.getCenter(new THREE.Vector3()).multiplyScalar((s * 2.2) / size));
    holder.clear(); holder.add(gltf.scene);
  } catch (err) { console.warn(`Model assets/models/${id}.glb could not load; keeping the built-in model.`, err); }
}

function galaxyCloud(glow, radius, count, color, spiral) {
  const pos = new Float32Array(count * 3), col = new Float32Array(count * 3), c = new THREE.Color();
  for (let i = 0; i < count; i++) {
    const r = Math.pow(Math.random(), 0.6) * radius;
    const a = spiral ? (i % 2) * Math.PI + r * 0.12 + (Math.random() - 0.5) * 0.8 : Math.random() * Math.PI * 2;
    pos.set([Math.cos(a) * r, (Math.random() - 0.5) * radius * 0.08, Math.sin(a) * r], i * 3);
    c.set(color).offsetHSL((Math.random() - 0.5) * 0.08, 0, (1 - r / radius) * 0.25); col.set([c.r, c.g, c.b], i * 3);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  return new THREE.Points(geo, new THREE.PointsMaterial({ size: 1.1, map: glow, vertexColors: true, transparent: true, opacity: 0.35, depthWrite: false, blending: THREE.AdditiveBlending }));
}
const CLUSTER_LOOK = { kree: ['#bcd4ff', false], fornax: ['#ffd9c4', false], andromeda: ['#cfe0ff', true] };

/** Builds every world of Earth-616 around `center`. @returns {{ group, meshes, labels, update }} */
export function buildPlanets(k) {
  const { PLANETS, REGIONS, MODELS = [] } = window.MULTIVERSE;
  const g = new THREE.Group(); g.position.copy(k.center);
  const cache = {}, loader = new THREE.TextureLoader();
  k.tex = name => (cache[name] ??= Object.assign(loader.load(`assets/textures/planets/${name}.jpg`), { colorSpace: THREE.SRGBColorSpace, anisotropy: k.anisotropy }));
  const labels = [], meshes = [], updates = [];
  const addLabel = (obj, at) => { obj.position.copy(at); g.add(obj); labels.push(obj); return obj; };

  // Yggdrasil grows out of Earth and holds the Nine Realms
  g.add(k.tube([V(0, 10, 0), V(26, 60, 10), V(-12, 110, -6), V(0, REALM_Y - 6, 0), V(0, ASGARD_Y - 14, 0)], 0.55, k.flowMat(k.GOLD, 0.6, 0.18), 160));
  addLabel(k.label('tier', REGIONS.realms), V(0, REALM_Y - 26, 0));
  Object.entries(CLUSTERS).forEach(([id, [r, ang]]) => {
    const p = polar(r, ang), [color, spiral] = CLUSTER_LOOK[id], cloud = galaxyCloud(k.glow, 48, spiral ? 1600 : 700, color, spiral);
    cloud.position.copy(p).setY(-8); g.add(cloud); addLabel(k.label('tier', REGIONS[id]), p.clone().setY(-26));
  });
  addLabel(k.label('tier', REGIONS.deep), polar(DEEP_R, 0, -40));

  const totals = {}, counts = {};
  PLANETS.forEach(row => { totals[row[2]] = (totals[row[2]] ?? 0) + 1; });
  PLANETS.forEach(([id, name, region, model, tint, size, note]) => {
    const i = (counts[region] = (counts[region] ?? -1) + 1), n = totals[region];
    const p = region === 'sol' ? polar(22, 210, 12)
      : region === 'realms' ? (id === 'asgard' ? V(0, ASGARD_Y, 0) : polar(REALM_R, (i - 1) * (360 / (n - 1)), REALM_Y + (i % 2) * 14))
      : region === 'deep' ? polar(DEEP_R, -DEEP_SPAN / 2 + (i / (n - 1)) * DEEP_SPAN, i % 2 ? 16 : -16)
      : polar(...CLUSTERS[region]).add(n === 1 ? V(0, 6, 0) : polar(30, i * (360 / n) + 20, 6 + i * 6));
    if (region === 'realms' && id !== 'asgard') g.add(k.tube([V(0, REALM_Y - 6, 0), p.clone().multiplyScalar(0.5).setY(REALM_Y + 12), p], 0.35, k.flowMat(k.GOLD, 0.55, 0.25), 40));
    const holder = new THREE.Group(); holder.position.copy(p); g.add(holder);
    const built = (BUILT[model] ?? ((s, kk) => texturedPlanet(model, tint, s, kk)))(size, k);
    holder.add(built.obj); if (built.update) updates.push(built.update);
    if (MODELS.includes(id)) swapInLicensedModel(holder, id, size);
    const pick = new THREE.Mesh(k.sphereGeo, new THREE.MeshBasicMaterial({ visible: false })); // raycast target for odd shapes
    pick.scale.setScalar(size * 1.25); pick.position.copy(p);
    pick.userData.place = { id, name, region, note, color: tint, regionName: REGIONS[region] ?? 'Solar System' };
    g.add(pick); meshes.push(pick);
    const tag = addLabel(k.label('elabel plabel', name, pick.userData.place.regionName), p.clone().add(V(0, size * 1.35 + 2, 0)));
    tag.element.style.color = tint; tag.element.addEventListener('click', () => k.onPick(pick.userData.place));
  });
  return { group: g, meshes, labels, update: dt => updates.forEach(u => u(dt)) };
}
