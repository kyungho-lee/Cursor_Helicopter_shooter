export const PHYSICS = {
  // 이동 관련
  MAX_SPEED: 300,
  ACCELERATION: 200,
  FRICTION: 0.95,  // 공기 저항 감소
  
  // 회전 관련
  MAX_ROTATION: Math.PI / 4,  // 45도
  ROTATION_RETURN_SPEED: Math.PI,
  
  // 경계 처리
  BOUNCE_DAMPING: 0.5
};

export const PROPELLER = {
  ROTATION_SPEED: Math.PI * 10,  // 10π rad/s
  SCALE: 1.2,                    // 본체 대비 크기
  BLADE_COUNT: 4,                // 프로펠러 날개 수
  OFFSET_Y: -20                  // 본체 상단으로부터 오프셋
};

export const SMOKE = {
  SPAWN_RATE: 10,          // 초당 파티클 수
  LIFETIME: 2,           // 파티클 수명 (초)
  MIN_SIZE: 2,            // 최소 크기
  MAX_SIZE: 5,            // 최대 크기
  SPEED: 50,              // 파티클 이동 속도
  ALPHA_DECAY: 0.5      // 투명도 감소율
}; 