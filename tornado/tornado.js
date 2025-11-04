// 토네이도 파티클 생성/업데이트

import * as THREE from "three";

export function createTornado(scene, params) {
  const count = params.tornado.particles;
  const positions = new Float32Array(count * 3);
  const speeds = new Float32Array(count);
  const heights = new Float32Array(count);
  const radii = new Float32Array(count);

  const radiusAt = (y) =>
    THREE.MathUtils.lerp(
      params.tornado.topRadius,
      params.tornado.baseRadius,
      y / params.tornado.height
    );
  const rnd = (a = 0, b = 1) => a + Math.random() * (b - a);

  for (let i = 0; i < count; i++) {
    const y = rnd(0, params.tornado.height);
    const r = radiusAt(y) * rnd(0.88, 1.02);
    const a = rnd(0, Math.PI * 2);
    positions[i * 3] = Math.cos(a) * r;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = Math.sin(a) * r;
    heights[i] = y;
    radii[i] = r;
    const inner = THREE.MathUtils.clamp(
      1 - r / (params.tornado.baseRadius + 1e-4),
      0.05,
      1.0
    );
    speeds[i] = rnd(0.8, 1.2) * (1 + params.tornado.innerBoost * inner);
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.08,
    color: new THREE.Color(params.color),
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });
  const points = new THREE.Points(geom, mat);
  scene.add(points);

  // dust(간단)
  const dust = new THREE.Points(
    new THREE.BufferGeometry(),
    new THREE.PointsMaterial({
      size: 0.06,
      color: 0x9fb6ff,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  scene.add(dust);

  // shells(필요시 생략 가능)
  const shells = new THREE.Group();
  scene.add(shells);

  return {
    points,
    geom,
    positions,
    speeds,
    heights,
    radii,
    dust,
    shells,
    radiusAt,
  };
}

export function updateTornado(state, params, dt, t) {
  const { geom, heights, radii, speeds, radiusAt } = state;
  const pos = geom.getAttribute("position");
  const p = params.tornado;

  for (let i = 0; i < p.particles; i++) {
    heights[i] +=
      p.updraft * dt * (0.7 + 0.3 * Math.sin((i * 13.37 + t) * 0.5));
    if (heights[i] > p.height) heights[i] -= p.height;

    const baseR = radiusAt(heights[i]);
    const pulse = 1 + p.pulse * Math.sin(t * 1.6 + i * 0.05);
    const r = baseR * pulse * (0.92 + 0.16 * Math.sin(i * 0.23 + t * 0.9));
    radii[i] = r;

    const spin = speeds[i] * p.swirl * dt;
    const angle = t * spin * 8.0 + i;
    const wobX = p.wobble * Math.sin(t * 0.9) * (1 - heights[i] / p.height);
    const wobZ = p.wobble * Math.cos(t * 1.1) * (1 - heights[i] / p.height);

    pos.array[i * 3] = Math.cos(angle) * r + wobX;
    pos.array[i * 3 + 1] = heights[i];
    pos.array[i * 3 + 2] = Math.sin(angle) * r + wobZ;
  }
  pos.needsUpdate = true;
}
