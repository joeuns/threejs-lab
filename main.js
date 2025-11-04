import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// 1. 장면(Scene) 생성
const scene = new THREE.Scene();

// 2. 카메라(Camera) 설정
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

// 3. 렌더러(Renderer) 설정
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 4. 오브젝트(Object) 생성: 상자
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// 5. 카메라 컨트롤러 추가 (마우스로 시점 조작 가능)
const controls = new OrbitControls(camera, renderer.domElement);

// 6. 애니메이션 루프
function animate() {
  requestAnimationFrame(animate);

  // 상자 회전
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  controls.update();
  renderer.render(scene, camera);
}
animate();

// 7. 화면 크기 조절에 대응
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
