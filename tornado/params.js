// 모든 파라미터 객체(토네이도/인터랙션/잔상)

export const params = {
  color: "#a8c7ff",
  tornado: {
    height: 10,
    baseRadius: 6,
    topRadius: 2,
    particles: 6000,
    swirl: 1.6,
    updraft: 2.0,
    wobble: 0.6,
    innerBoost: 1.6,
    pulse: 0.15,
  },
  dust: { enabled: true },
  interaction: {
    enabled: true,
    radius: 2.5,
    strength: 2,
    falloff: 2.0,
    lerp: 0.25,
  },
  trail: {
    enabled: true,
    max: 180,
    lifespan: 0.6,
    spawnSpeed: 2.4,
    spawnInterval: 0.012,
    sizeStart: 1.3,
    sizeEnd: 0.3,
    opacity: 0.4,
    swirl: 0.8,
    drift: 0.2,
  },
};
