export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;

export const PLAYER = {
  WIDTH: 50,
  HEIGHT: 30,
  INITIAL_SPEED: 0,
  MAX_SPEED: 5
};

export const BULLET = {
  WIDTH: 4,
  HEIGHT: 4,
  SPEED: 500
};

export const MISSILE = {
  WIDTH: 8,
  HEIGHT: 16,
  SPEED: 300,
  TURN_SPEED: 0.1
};

export const WEAPON = {
  BULLET_COOLDOWN: 0.15,  // 초 (연사 간격)
  MISSILE_COOLDOWN: 2.0,  // 초 (미사일 재장전)
};

export const ENEMY = {
  TANK: {
    WIDTH: 48,
    HEIGHT: 32,
    SPEED: 100,
    HEALTH: 2
  },
  HELICOPTER: {
    WIDTH: 64,
    HEIGHT: 32,
    SPEED: 150,
    HEALTH: 1
  },
  PARATROOPER: {
    WIDTH: 24,
    HEIGHT: 32,
    FALL_SPEED: 100
  }
};

export const SCORE = {
  TANK: 100,
  HELICOPTER: 150,
  PARATROOPER_SAVED: 200
}; 