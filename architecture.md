# 헬리콥터 슈터 게임 아키텍처

## 1. 핵심 컴포넌트

### 1.1 Entity System
```typescript
abstract class Entity {
  protected position: Vector2D;
  protected velocity: Vector2D;
  protected size: Vector2D;
  protected isActive: boolean;

  abstract update(deltaTime: number): void;
  abstract render(ctx: CanvasRenderingContext2D): void;
}
```
- 모든 게임 오브젝트의 기본 클래스
- 위치, 속도, 크기, 활성화 상태 관리
- 충돌 감지 기능 내장

### 1.2 Vector2D System
```typescript
class Vector2D {
  constructor(x: number, y: number);
  add(v: Vector2D): Vector2D;
  subtract(v: Vector2D): Vector2D;
  multiply(n: number): Vector2D;
  magnitude(): number;
  normalize(): Vector2D;
  static distance(v1: Vector2D, v2: Vector2D): number;
}
```
- 2D 벡터 연산 유틸리티
- 위치, 속도, 가속도 계산에 사용
- 정규화, 거리 계산 기능 제공

### 1.3 Input System
```typescript
class InputManager {
  private static instance: InputManager;
  private keys: { [key: string]: boolean };

  static getInstance(): InputManager;
  isKeyPressed(keyCode: string): boolean;
  reset(): void;
}
```
- 싱글톤 패턴 적용
- 키보드 입력 상태 관리
- 실시간 키 상태 확인 가능

## 2. 플레이어 시스템

### 2.1 물리 시스템
```typescript
interface PhysicsConstants {
  ROTATION_SPEED: number;    // Math.PI * 1.5
  MAX_ROTATION: number;      // Math.PI / 4 (45도)
  ENGINE_POWER: number;      // 500
  MAX_SPEED: number;        // PLAYER.MAX_SPEED
  FRICTION: number;         // 0.97
}
```
- 가속도 기반 이동 시스템
- 회전 물리 시스템
- 공기 저항 및 마찰력 시뮬레이션

### 2.2 프로펠러 시스템
```typescript
interface PropellerSystem {
  ROTATION_SPEED: number;    // Math.PI * 15
  BLADE_LENGTH: number;      // size.x * 0.8
  BLADE_WIDTH: number;       // 4
  BLADES_COUNT: number;      // 2
}
```
- 독립적인 프로펠러 회전 시스템
- 회전 각도 자동 계산
- 크로스 형태의 프로펠러 렌더링

### 2.3 연기 효과 시스템
```typescript
interface Smoke {
  position: Vector2D;
  size: number;
  opacity: number;
  speed: Vector2D;
}

interface SmokeSystem {
  EMISSION_RATE: number;     // 0.05초
  INITIAL_SIZE: number;      // 5-10
  INITIAL_OPACITY: number;   // 0.7
  GROWTH_RATE: number;       // 20 units/s
  FADE_RATE: number;        // 0.5/s
  BASE_SPEED: number;       // 50
  SPREAD: number;           // 20
}
```
- 파티클 기반 연기 시스템
- 동적 파티클 생성 및 소멸
- 방향 기반 연기 분산

## 3. 디버그 시스템

### 3.1 상태 표시
```typescript
interface DebugInfo {
  speed: number;
  angle: number;
  isMoving: boolean;
  position: Vector2D;
  particleCount: number;
}
```
- 실시간 상태 모니터링
- 성능 지표 표시
- 개발 모드 전용 정보

## 4. 렌더링 시스템

### 4.1 레이어 구조
1. 배경 레이어
2. 연기 효과 레이어
3. 플레이어 레이어
4. UI/디버그 레이어

### 4.2 렌더링 최적화
- Canvas 컨텍스트 상태 관리
- 트랜스폼 매트릭스 활용
- 레이어별 독립적 렌더링

## 5. 상수 관리
```typescript
const PLAYER = {
  WIDTH: 64,
  HEIGHT: 32,
  SPEED: 300,
  MAX_SPEED: 400,
  FRICTION: 0.95
};
```
- 중앙 집중식 상수 관리
- 카테고리별 상수 그룹화
- 손쉬운 밸런싱 조정 가능

## 6. 확장 포인트

### 6.1 무기 시스템 (예정)
```typescript
interface Weapon {
  shoot(): void;
  reload(): void;
  update(deltaTime: number): void;
}
```
- 총알 발사 시스템
- 미사일 발사 시스템
- 무기 교체 시스템

### 6.2 적 AI 시스템 (예정)
```typescript
interface EnemyBehavior {
  update(deltaTime: number): void;
  attack(): void;
  move(): void;
}
```
- 적 행동 패턴
- 공격 패턴
- 이동 패턴

### 6.3 충돌 처리 시스템 (예정)
```typescript
interface CollisionSystem {
  checkCollision(entity1: Entity, entity2: Entity): boolean;
  handleCollision(entity1: Entity, entity2: Entity): void;
}
```
- 충돌 감지
- 충돌 응답
- 히트박스 관리 