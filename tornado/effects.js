// 잔상(스프라이트 풀) 생성/업데이트

import * as THREE from "three";

export function createAfterimage(scene, trailParams) {
  const texture = makeRadial(256);
  const material = new THREE.SpriteMaterial({
    map: texture,
    color: new THREE.Color("#a8c7ff"),
    transparent: true,
    opacity: trailParams.opacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const group = new THREE.Group();
  scene.add(group);
  const pool = [];
  let index = 0;
  for (let i = 0; i < trailParams.max; i++) {
    const s = new THREE.Sprite(material.clone());
    s.visible = false;
    s.scale.set(trailParams.sizeStart, trailParams.sizeStart, 1);
    s.userData = {
      age: 0,
      life: trailParams.lifespan,
      vel: new THREE.Vector3(),
      rot: Math.random() * Math.PI * 2,
    };
    group.add(s);
    pool.push(s);
  }
  return { group, pool, index: 0 };
}

function makeRadial(size = 128) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );
  g.addColorStop(0, "rgba(255,255,255,1.0)");
  g.addColorStop(0.5, "rgba(255,255,255,0.35)");
  g.addColorStop(1, "rgba(255,255,255,0.0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(c);
}

export function maybeSpawnAfterimage(state, pointer, trailParams, now) {
  if (!trailParams.enabled || !pointer.hover.valid) return;
  const { pool } = state;
  const dx = pointer.hover.smooth.x - pointer.hover.last.x;
  const dy = pointer.hover.smooth.y - pointer.hover.last.y;
  const dz = pointer.hover.smooth.z - pointer.hover.last.z;
  const dt = Math.max(1e-4, now - pointer.hover.lastTime);
  const speed = Math.sqrt(dx * dx + dy * dy + dz * dz) / dt;

  state._cooldown = (state._cooldown ?? 0) - dt;
  if (speed > trailParams.spawnSpeed && state._cooldown <= 0) {
    const s = pool[state.index];
    state.index = (state.index + 1) % pool.length;
    s.position.copy(pointer.hover.smooth);
    s.userData.age = 0;
    s.userData.life = trailParams.lifespan;
    s.userData.vel
      .set(dx, dy, dz)
      .normalize()
      .multiplyScalar(trailParams.drift);
    s.material.opacity = trailParams.opacity;
    s.scale.set(trailParams.sizeStart, trailParams.sizeStart, 1);
    s.visible = true;
    state._cooldown = trailParams.spawnInterval;
  }
  pointer.hover.last.copy(pointer.hover.smooth);
  pointer.hover.lastTime = now;
}

export function updateAfterimage(state, trailParams, dt) {
  for (const s of state.pool) {
    if (!s.visible) continue;
    s.userData.age += dt;
    const t = s.userData.age / s.userData.life;
    if (t >= 1) {
      s.visible = false;
      continue;
    }
    const k = 1 - t;
    const scale = THREE.MathUtils.lerp(
      trailParams.sizeStart,
      trailParams.sizeEnd,
      1 - k * k
    );
    s.scale.set(scale, scale, 1);
    s.material.opacity = trailParams.opacity * k * k;
    s.position.addScaledVector(s.userData.vel, dt);
    s.userData.rot += trailParams.swirl * dt;
    s.material.rotation = s.userData.rot;
  }
}
