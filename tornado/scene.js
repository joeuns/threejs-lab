// renderer, scene, camera, controls, ground, lights

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export function createScene(canvasParent) {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  canvasParent.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0b0f14, 0.015);

  const camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    500
  );
  camera.position.set(10, 7, 16);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.target.set(0, 5, 0);

  // lights & ground(필요 최소만)
  scene.add(new THREE.HemisphereLight(0xbcd3ff, 0x090b10, 0.7));
  const dir = new THREE.DirectionalLight(0xaec8ff, 1.25);
  dir.position.set(-6, 12, 6);
  dir.castShadow = true;
  scene.add(dir);
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(14, 64),
    new THREE.MeshStandardMaterial({ color: 0x0d1420 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  return { renderer, scene, camera, controls };
}
