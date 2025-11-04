// 엔트리: 렌더 루프, 리사이즈/키보드, 모듈 묶기

import { createScene } from "./scene.js";
import { params } from "./params.js";
import { createTornado, updateTornado } from "./tornado.js";
import { createInteraction } from "./interaction.js";
import {
  createAfterimage,
  maybeSpawnAfterimage,
  updateAfterimage,
} from "./effects.js";
import { createDust, updateDust } from "./dust.js";
import { mountGUI } from "./gui.js";

const container = document.getElementById("app");
const { renderer, scene, camera, controls } = createScene(container);

const tornado = createTornado(scene, params);
const interaction = createInteraction(
  scene,
  renderer,
  camera,
  params,
  tornado.radiusAt
);
const dust = createDust(scene, params);
const afterimage = createAfterimage(scene, params.trail);

mountGUI(params, {
  onTornadoShapeChange: () => interaction.syncCollider(params.tornado),
});

let running = true,
  t = 0;
function loop(nowMs) {
  const now = nowMs * 0.001;
  const dt = 0.016;

  interaction.updateHover(dt, params.interaction.lerp);
  updateTornado(tornado, params, dt, t);
  interaction.applyRepulsion(tornado, params.interaction);

  updateDust(dust, params, dt, t);

  maybeSpawnAfterimage(afterimage, interaction, params.trail, now);
  updateAfterimage(afterimage, params.trail, dt);

  controls.update();
  renderer.render(scene, camera);
  t += dt;
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

window.addEventListener("resize", () => {
  const w = window.innerWidth,
    h = window.innerHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
});
window.addEventListener("keydown", (e) => {
  if (e.code === "Space") running = !running;
  if (e.key.toLowerCase() === "r") controls.reset();
});
