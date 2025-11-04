// 포인터(raycaster), 콜라이더, 반발 로직

import * as THREE from "three";

export function createInteraction(scene, renderer, camera, params, radiusAt) {
  // 보이지 않는 실린더
  const collider = new THREE.Mesh(
    new THREE.CylinderGeometry(
      params.tornado.baseRadius * 1.05,
      params.tornado.topRadius * 1.05,
      params.tornado.height,
      24,
      1,
      true
    ),
    new THREE.MeshBasicMaterial({ visible: false })
  );
  collider.position.y = params.tornado.height * 0.5;
  scene.add(collider);

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const hover = {
    valid: false,
    point: new THREE.Vector3(),
    smooth: new THREE.Vector3(),
    last: new THREE.Vector3(),
    lastTime: performance.now() * 0.001,
  };

  function onMove(ev) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const hit = raycaster.intersectObject(collider, false)[0];
    if (hit) {
      hover.point.copy(hit.point);
      hover.valid = true;
    } else hover.valid = false;
  }
  renderer.domElement.addEventListener("pointermove", onMove);
  renderer.domElement.addEventListener(
    "pointerleave",
    () => (hover.valid = false)
  );

  function updateHover(dt, lerp = 0.25) {
    if (hover.valid) hover.smooth.lerp(hover.point, lerp);
  }

  function applyRepulsion(tornadoState, interactionParams) {
    if (!interactionParams.enabled || !hover.valid) return;
    const { geom } = tornadoState;
    const pos = geom.getAttribute("position");
    const R = interactionParams.radius,
      R2 = R * R,
      s = interactionParams.strength;

    for (let i = 0; i < pos.count; i++) {
      const idx = i * 3;
      let x = pos.array[idx],
        y = pos.array[idx + 1],
        z = pos.array[idx + 2];
      const dx = x - hover.smooth.x,
        dy = y - hover.smooth.y,
        dz = z - hover.smooth.z;
      const d2 = dx * dx + dy * dy + dz * dz;
      if (d2 < R2) {
        const d = Math.sqrt(d2) + 1e-6;
        const w = Math.pow(1 - d / R, interactionParams.falloff) * s;
        const inv = w / d;
        pos.array[idx] = x + dx * inv;
        pos.array[idx + 1] = y + dy * inv * 0.5;
        pos.array[idx + 2] = z + dz * inv;
      }
    }
    pos.needsUpdate = true;
  }

  function syncCollider(p) {
    collider.geometry.dispose();
    collider.geometry = new THREE.CylinderGeometry(
      p.baseRadius * 1.05,
      p.topRadius * 1.05,
      p.height,
      24,
      1,
      true
    );
    collider.position.y = p.height * 0.5;
  }

  return { collider, hover, updateHover, applyRepulsion, syncCollider };
}
