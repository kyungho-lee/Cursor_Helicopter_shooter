import { Entity } from './Entity';
import { Vector2D } from '../utils/Vector2D';
import { InputManager } from '../core/InputManager';
import { PLAYER } from '../utils/Constants';
import { PHYSICS, PROPELLER, SMOKE } from '../constants/PhysicsConstants';
import { SmokeParticle } from './SmokeParticle';

interface Smoke {
  position: Vector2D;
  size: number;
  opacity: number;
  speed: Vector2D;
}

export class Player extends Entity {
  private acceleration: Vector2D = new Vector2D(0, 0);
  private rotation: number = 0;
  private rotationSpeed: number = Math.PI * 1.5; // 회전 속도 증가
  private maxRotation: number = Math.PI / 4; // 최대 회전 각도 45도로 증가
  private enginePower: number = 0;
  private input: InputManager;
  private isEngineOn: boolean = false;
  
  // 프로펠러 관련 변수
  private propellerAngle: number = 0;
  private propellerSpeed: number = Math.PI * 15; // 프로펠러 회전 속도
  private propellerImage: HTMLImageElement;  // 프로펠러 이미지 추가
  
  // 연기 효과 관련 변수
  private smokeParticles: SmokeParticle[] = [];
  private smokeEmissionRate: number = 0.05; // 연기 생성 간격
  private smokeTimer: number = 0;
  
  // 디버그용 상태 변수
  private debug: {
    speed: number;
    angle: number;
    isMoving: boolean;
  };

  constructor(x: number, y: number, image: HTMLImageElement, propellerImage: HTMLImageElement) {
    super(x, y, image);
    this.input = InputManager.getInstance();
    this.setupInputBindings();
    this.debug = {
      speed: 0,
      angle: 0,
      isMoving: false
    };
    this.propellerImage = propellerImage;
  }

  private setupInputBindings(): void {
    // 즉시 실행되는 액션 바인딩
    this.input.bindKey(' ', () => this.shoot());
    this.input.bindKey('Control', () => this.launchMissile());

    // 지속적으로 실행되는 액션 바인딩
    this.input.bindContinuousAction('ArrowLeft', (deltaTime) => {
        this.acceleration.x = -PHYSICS.ACCELERATION * deltaTime;
        this.rotation = -PHYSICS.MAX_ROTATION;
        this.isEngineOn = true;
    });

    this.input.bindContinuousAction('ArrowRight', (deltaTime) => {
        this.acceleration.x = PHYSICS.ACCELERATION * deltaTime;
        this.rotation = PHYSICS.MAX_ROTATION;
        this.isEngineOn = true;
    });

    this.input.bindContinuousAction('ArrowUp', (deltaTime) => {
        this.acceleration.y = -PHYSICS.ACCELERATION * deltaTime;
        this.isEngineOn = true;
    });

    this.input.bindContinuousAction('ArrowDown', (deltaTime) => {
        this.acceleration.y = PHYSICS.ACCELERATION * deltaTime;
        this.isEngineOn = true;
    });
  }

  public update(deltaTime: number): void {
    // 입력 매니저 업데이트
    this.input.update(deltaTime);
    
    // 엔진 상태 초기화 (매 프레임)
    this.isEngineOn = false;
    
    this.updatePhysics(deltaTime);
    this.updatePropeller(deltaTime);
    this.updateSmoke(deltaTime);
    this.updatePerformance(deltaTime);
    this.checkBoundaries();
    this.clampPosition();
    this.updateDebugInfo();
  }

  private updatePhysics(deltaTime: number): void {
    // 마찰력 적용
    this.acceleration.x *= Math.pow(PHYSICS.FRICTION, deltaTime);
    this.acceleration.y *= Math.pow(PHYSICS.FRICTION, deltaTime);

    // 최대 속도 제한
    const currentSpeed = this.velocity.magnitude();
    if (currentSpeed > PHYSICS.MAX_SPEED) {
        this.velocity = this.velocity.normalize().multiply(PHYSICS.MAX_SPEED);
    }

    // 위치 업데이트
    this.position = this.position.add(this.acceleration.multiply(deltaTime));
    
    // 회전 복원
    if (!this.input.isKeyPressed('ArrowLeft') && !this.input.isKeyPressed('ArrowRight')) {
        const rotationStep = PHYSICS.ROTATION_RETURN_SPEED * deltaTime;
        if (Math.abs(this.rotation) > rotationStep) {
            this.rotation -= Math.sign(this.rotation) * rotationStep;
        } else {
            this.rotation = 0;
        }
    }
  }

  private updatePropeller(deltaTime: number): void {
    // 프로펠러 회전
    this.propellerAngle += PROPELLER.ROTATION_SPEED * deltaTime;
    if (this.propellerAngle > Math.PI * 2) {
      this.propellerAngle -= Math.PI * 2;
    }
  }

  private updateSmoke(deltaTime: number): void {
    const now = Date.now();
    
    // 새 연기 파티클 생성
    if (now - this.smokeTimer > 1000 / SMOKE.SPAWN_RATE) {
      this.smokeTimer = now;
      this.smokeParticles.push(new SmokeParticle(
        this.position.x + this.size.x / 2,
        this.position.y + this.size.y,
        SMOKE.LIFETIME
      ));
    }

    // 기존 파티클 업데이트 및 제거
    this.smokeParticles = this.smokeParticles.filter(particle => {
      particle.update(deltaTime);
      return particle.isAlive();
    });
  }

  private updatePerformance(deltaTime: number): void {
    // Implementation of updatePerformance method
  }

  private checkBoundaries(): void {
    // 화면 경계 처리
    this.position.x = Math.max(0, Math.min(800 - this.size.x, this.position.x));
    this.position.y = Math.max(0, Math.min(600 - this.size.y, this.position.y));

    // 화면 경계에서 속도 감소
    if (this.position.x <= 0 || this.position.x >= 800 - this.size.x) {
      this.velocity.x *= PHYSICS.BOUNCE_DAMPING;
    }
    if (this.position.y <= 0 || this.position.y >= 600 - this.size.y) {
      this.velocity.y *= PHYSICS.BOUNCE_DAMPING;
    }
  }

  private clampPosition(): void {
    // 화면 경계 처리
    this.position.x = Math.max(0, Math.min(800 - this.size.x, this.position.x));
    this.position.y = Math.max(0, Math.min(600 - this.size.y, this.position.y));

    // 화면 경계에서 속도 감소
    if (this.position.x <= 0 || this.position.x >= 800 - this.size.x) {
      this.velocity.x *= PHYSICS.BOUNCE_DAMPING;
    }
    if (this.position.y <= 0 || this.position.y >= 600 - this.size.y) {
      this.velocity.y *= PHYSICS.BOUNCE_DAMPING;
    }
  }

  private updateDebugInfo(): void {
    this.debug.speed = Math.round(this.velocity.magnitude());
    this.debug.angle = Math.round((this.propellerAngle * 180) / Math.PI);
    this.debug.isMoving = this.isEngineOn;
  }

  public render(ctx: CanvasRenderingContext2D): void {
    // 연기 렌더링
    this.renderSmoke(ctx);

    ctx.save();
    
    // 헬리콥터 중심점으로 이동
    ctx.translate(
      this.position.x + this.size.x / 2,
      this.position.y + this.size.y / 2
    );
    
    // 회전 적용
    ctx.rotate(this.propellerAngle);

    // 프로토타입 헬리콥터 본체
    ctx.drawImage(this.image, -this.size.x / 2, -this.size.y / 2);

    // 프로펠러 렌더링
    this.renderPropeller(ctx);

    // 방향 표시 선
    ctx.beginPath();
    ctx.strokeStyle = '#ffffff';
    ctx.moveTo(0, 0);
    ctx.lineTo(this.size.x / 2, 0);
    ctx.stroke();

    // 엔진 효과
    if (this.isEngineOn) {
      ctx.fillStyle = '#ff6600';
      ctx.fillRect(
        -this.size.x / 2 - 10,
        -this.size.y / 4,
        10,
        this.size.y / 2
      );
    }

    ctx.restore();

    // 디버그 정보 표시
    this.renderDebugInfo(ctx);
  }

  private renderPropeller(ctx: CanvasRenderingContext2D): void {
    const propellerLength = this.size.x * 0.8;
    const propellerWidth = 4;

    ctx.save();
    ctx.drawImage(this.propellerImage, -propellerLength / 2, -propellerWidth / 2, propellerLength, propellerWidth);
    ctx.restore();
  }

  private renderSmoke(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    for (const particle of this.smokeParticles) {
      particle.draw(ctx);
    }
    ctx.restore();
  }

  private renderDebugInfo(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`Speed: ${this.debug.speed}`, 10, 20);
    ctx.fillText(`Angle: ${this.debug.angle}°`, 10, 40);
    ctx.fillText(`Engine: ${this.debug.isMoving ? 'ON' : 'OFF'}`, 10, 60);
    ctx.fillText(`Pos: (${Math.round(this.position.x)}, ${Math.round(this.position.y)})`, 10, 80);
    ctx.fillText(`Smoke particles: ${this.smokeParticles.length}`, 10, 100);
  }

  public shoot(): void {
    // 총알 발사 로직 (나중에 구현)
  }

  public launchMissile(): void {
    // 미사일 발사 로직 (나중에 구현)
  }

  // Entity 클래스의 추상 메서드 구현
  public draw(ctx: CanvasRenderingContext2D): void {
    this.render(ctx);
  }

  public getDebugInfo(): {
    fps: number;
    speed: number;
    angle: number;
    isMoving: boolean;
    particles: number;
  } {
    return {
      fps: Math.round(1 / (performance.now() - this.lastFrameTime)),
      speed: this.debug.speed,
      angle: this.debug.angle,
      isMoving: this.debug.isMoving,
      particles: this.smokeParticles.length
    };
  }
} 