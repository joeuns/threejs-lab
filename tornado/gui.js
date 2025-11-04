// lil-gui로 파라미터 바인딩

import GUI from "lil-gui";

export function mountGUI(params, hooks) {
  const gui = new GUI({ title: "Controls" });
  gui.addColor(params, "color").name("Color");
  gui
    .add(params.tornado, "height", 6, 18, 0.1)
    .name("Height")
    .onChange(hooks.onTornadoShapeChange);
  gui
    .add(params.tornado, "baseRadius", 3, 10, 0.1)
    .name("Base Radius")
    .onChange(hooks.onTornadoShapeChange);
  gui
    .add(params.tornado, "topRadius", 0.2, 4, 0.1)
    .name("Top Radius")
    .onChange(hooks.onTornadoShapeChange);
  gui.add(params.tornado, "swirl", 0.2, 4, 0.05);
  gui.add(params.tornado, "updraft", 0.2, 5, 0.05);
  gui.add(params.tornado, "wobble", 0, 1.5, 0.01);
  gui.add(params.tornado, "innerBoost", 0, 3, 0.05);
  gui.add(params.tornado, "pulse", 0, 0.6, 0.01);
  gui.add(params.dust, "enabled").name("Dust ring");

  const fInter = gui.addFolder("Interaction");
  fInter.add(params.interaction, "enabled");
  fInter.add(params.interaction, "radius", 0.3, 3, 0.05);
  fInter.add(params.interaction, "strength", 0.1, 2, 0.05);
  fInter.add(params.interaction, "falloff", 1, 4, 0.1);
  fInter.add(params.interaction, "lerp", 0, 0.6, 0.01);

  const fTrail = gui.addFolder("Afterimage");
  fTrail.add(params.trail, "enabled");
  fTrail.add(params.trail, "lifespan", 0.2, 1.2, 0.05);
  fTrail.add(params.trail, "spawnSpeed", 0.2, 6, 0.1);
  fTrail.add(params.trail, "spawnInterval", 0.006, 0.06, 0.002);
  fTrail.add(params.trail, "sizeStart", 0.2, 2, 0.05);
  fTrail.add(params.trail, "sizeEnd", 0.05, 1, 0.05);
  fTrail.add(params.trail, "opacity", 0.1, 1, 0.05);
  fTrail.add(params.trail, "swirl", 0, 3, 0.05);
  fTrail.add(params.trail, "drift", 0, 0.6, 0.02);
}
