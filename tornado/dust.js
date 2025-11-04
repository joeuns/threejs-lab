// 하단 dust ring
import * as THREE from "three";

export function createDust(scene, params) {
  const count = 1200;
  const geom = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  const ang = new Float32Array(count);
  const rad = new Float32Array(count);

  const baseR = params.tornado?.baseRadius ?? 6;

  const rnd = (a = 0, b = 1) => a + Math.random() * (b - a);
  for (let i = 0; i < count; i++) {
    ang[i] = rnd(0, Math.PI * 2);
    rad[i] = rnd(baseR * 0.7, baseR * 1.1);
    const idx = i * 3;
    pos[idx] = Math.cos(ang[i]) * rad[i];
    pos[idx + 1] = rnd(0.02, 0.3); // 지면보다 살짝 위
    pos[idx + 2] = Math.sin(ang[i]) * rad[i];
  }
  geom.setAttribute("position", new THREE.BufferAttribute(pos, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.06,
    color: 0x9fb6ff,
    transparent: true,
    opacity: 0.35,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });

  const points = new THREE.Points(geom, mat);
  points.visible = params.dust?.enabled ?? true;
  // 혹시 지면과 깊이 충돌 시, 살짝 앞으로
  points.renderOrder = 1;

  scene.add(points);

  // 모듈 내부 상태 보관
  return {
    points,
    geom,
    ang,
    rad,
    count,
    // 업데이트 속도를 조금 변주하기 위한 스칼라
    baseSpeed: 0.6,
  };
}

export function updateDust(state, params, dt, t) {
  const { geom, ang, rad, count, baseSpeed } = state;
  const pos = geom.getAttribute("position");

  for (let i = 0; i < count; i++) {
    // 가벼운 회전 + 미세 변조
    ang[i] += dt * (baseSpeed + 0.5 * Math.sin(i * 0.07 + t));
    const idx = i * 3;
    pos.array[idx] = Math.cos(ang[i]) * rad[i];
    // y는 고정(살짝 들뜸 유지). 조금 흔들고 싶다면 아래 주석 해제
    // pos.array[idx+1] = 0.15 + 0.05 * Math.sin(i*0.31 + t*0.7);
    pos.array[idx + 2] = Math.sin(ang[i]) * rad[i];
  }
  pos.needsUpdate = true;

  // GUI 토글과 연계
  if (params?.dust) {
    state.points.visible = params.dust.enabled;
  }
}
