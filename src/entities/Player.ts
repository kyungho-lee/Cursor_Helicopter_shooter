import { Entity } from './Entity';
import { Vector2D } from '../utils/Vector2D';
import { InputManager } from '../core/InputManager';
import { CANVAS_WIDTH, CANVAS_HEIGHT, WEAPON } from '../utils/Constants';
import { PHYSICS, PROPELLER, SMOKE } from '../constants/PhysicsConstants';
import { SmokeParticle } from './SmokeParticle';
import { Bullet } from './Bullet';
import { Missile } from './Missile';

export class Player extends Entity {
  private acceleration: Vector2D = new Vector2D(0, 0);
  private rotation: number = 0;
  private isEngineOn: boolean = false;
  private input: InputManager;

  // 프로펠러
  private propellerAngle: number = 0;
  private propellerImage: HTMLImageElement;

  // 연기 효과
  private smokeParticles: SmokeParticle[] = [];
  private smokeTimer: number = 0;

  // 무기 시스템
  private bullets: Bullet[] = [];
  private missiles: Missile[] = [];
  private shootCooldown: number = 0;
  private missileCooldown: number = 0;

  // 디버그
  private debug = { speed: 0, angle: 0, isMoving: false };
  private lastFrameTime: number = performance.now();

  constructor(x: number, y: number, image: HTMLImageElement, propellerImage: HTMLImageElement) {
    super(x, y, image);
    this.input = InputManager.getInstance();
    this.propellerImage = propellerImage;
    this.setupInputBindings();
  }

  private setupInputBindings(): void {
    this.input.bindKey(' ', () => this.shoot());
    this.input.bindKey('Control', () => this.launchMissile());

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
    this.input.update(deltaTime);
    this.isEngineOn = false;

    this.updatePhysics(deltaTime);
    this.updatePropeller(deltaTime);
    this.updateSmoke(deltaTime);
    this.updateProjectiles(deltaTime);
    this.clampPosition();
    this.updateDebugInfo();

    this.lastFrameTime = performance.now();
  }

  private updatePhysics(deltaTime: number): void {
    this.acceleration.x *= Math.pow(PHYSICS.FRICTION, deltaTime);
    this.acceleration.y *= Math.pow(PHYSICS.FRICTION, deltaTime);

    const currentSpeed = this.velocity.magnitude();
    if (currentSpeed > PHYSICS.MAX_SPEED) {
      this.velocity = this.velocity.normalize().multiply(PHYSICS.MAX_SPEED);
    }

    this.position = this.position.add(this.acceleration.multiply(deltaTime));

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
    this.propellerAngle += PROPELLER.ROTATION_SPEED * deltaTime;
    if (this.propellerAngle > Math.PI * 2) {
      this.propellerAngle -= Math.PI * 2;
    }
  }

  private updateSmoke(deltaTime: number): void {
    const now = Date.now();

    if (now - this.smokeTimer > 1000 / SMOKE.SPAWN_RATE) {
      this.smokeTimer = now;
      this.smokeParticles.push(new SmokeParticle(
        this.position.x + this.size.x / 2,
        this.position.y + this.size.y,
        SMOKE.LIFETIME
      ));
    }

    this.smokeParticles = this.smokeParticles.filter(particle => {
      particle.update(deltaTime);
      return particle.isAlive();
    });
  }

  private updateProjectiles(deltaTime: number): void {
    // 쿨다운 갱신
    if (this.shootCooldown > 0) this.shootCooldown -= deltaTime;
    if (this.missileCooldown > 0) this.missileCooldown -= deltaTime;

    // 총알 업데이트 및 화면 벗어난 것 제거
    this.bullets = this.bullets.filter(bullet => {
      bullet.update(deltaTime);
      return bullet.isActive();
    });

    // 미사일 업데이트 및 화면 벗어난 것 제거
    this.missiles = this.missiles.filter(missile => {
      missile.update(deltaTime);
      return missile.isActive();
    });
  }

  private clampPosition(): void {
    this.position.x = Math.max(0, Math.min(CANVAS_WIDTH - this.size.x, this.position.x));
    this.position.y = Math.max(0, Math.min(CANVAS_HEIGHT - this.size.y, this.position.y));

    if (this.position.x <= 0 || this.position.x >= CANVAS_WIDTH - this.size.x) {
      this.velocity.x *= PHYSICS.BOUNCE_DAMPING;
    }
    if (this.position.y <= 0 || this.position.y >= CANVAS_HEIGHT - this.size.y) {
      this.velocity.y *= PHYSICS.BOUNCE_DAMPING;
    }
  }

  private updateDebugInfo(): void {
    this.debug.speed = Math.round(this.velocity.magnitude());
    this.debug.angle = Math.round((this.propellerAngle * 180) / Math.PI);
    this.debug.isMoving = this.isEngineOn;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    this.renderSmoke(ctx);
    this.renderProjectiles(ctx);

    ctx.save();
    ctx.translate(
      this.position.x + this.size.x / 2,
      this.position.y + this.size.y / 2
    );
    ctx.rotate(this.rotation);

    ctx.drawImage(this.image, -this.size.x / 2, -this.size.y / 2);
    this.renderPropeller(ctx);

    // 방향 표시
    ctx.beginPath();
    ctx.strokeStyle = '#ffffff';
    ctx.moveTo(0, 0);
    ctx.lineTo(this.size.x / 2, 0);
    ctx.stroke();

    // 엔진 효과
    if (this.isEngineOn) {
      ctx.fillStyle = '#ff6600';
      ctx.fillRect(-this.size.x / 2 - 10, -this.size.y / 4, 10, this.size.y / 2);
    }

    ctx.restore();

    // 미사일 쿨다운 HUD
    this.renderWeaponHUD(ctx);
  }

  private renderPropeller(ctx: CanvasRenderingContext2D): void {
    const propellerLength = this.size.x * 0.8;
    const propellerWidth = 4;

    ctx.save();
    ctx.rotate(this.propellerAngle - this.rotation);
    ctx.drawImage(this.propellerImage, -propellerLength / 2, -propellerWidth / 2, propellerLength, propellerWidth);
    ctx.restore();
  }

  private renderSmoke(ctx: CanvasRenderingContext2D): void {
    for (const particle of this.smokeParticles) {
      particle.draw(ctx);
    }
  }

  private renderProjectiles(ctx: CanvasRenderingContext2D): void {
    for (const bullet of this.bullets) bullet.draw(ctx);
    for (const missile of this.missiles) missile.draw(ctx);
  }

  private renderWeaponHUD(ctx: CanvasRenderingContext2D): void {
    const x = 10;
    const y = CANVAS_HEIGHT - 30;

    // 미사일 쿨다운 바
    const missileReady = this.missileCooldown <= 0;
    const progress = missileReady ? 1 : 1 - this.missileCooldown / WEAPON.MISSILE_COOLDOWN;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(x, y, 100, 12);

    ctx.fillStyle = missileReady ? '#00ff88' : '#ff8800';
    ctx.fillRect(x, y, 100 * progress, 12);

    ctx.fillStyle = '#ffffff';
    ctx.font = '10px monospace';
    ctx.fillText(`MSL: ${missileReady ? 'READY' : `${this.missileCooldown.toFixed(1)}s`}`, x + 2, y + 10);
  }

  public shoot(): void {
    if (this.shootCooldown > 0) return;

    this.shootCooldown = WEAPON.BULLET_COOLDOWN;
    // 헬리콥터 오른쪽 끝 중앙에서 발사
    this.bullets.push(new Bullet(
      this.position.x + this.size.x,
      this.position.y + this.size.y / 2
    ));
  }

  public launchMissile(): void {
    if (this.missileCooldown > 0) return;

    this.missileCooldown = WEAPON.MISSILE_COOLDOWN;
    // 헬리콥터 오른쪽 하단에서 발사
    this.missiles.push(new Missile(
      this.position.x + this.size.x,
      this.position.y + this.size.y * 0.75
    ));
  }

  // v0.5.0 충돌 처리를 위한 getter
  public getBullets(): Bullet[] {
    return this.bullets;
  }

  public getMissiles(): Missile[] {
    return this.missiles;
  }

  public getDebugInfo(): {
    fps: number;
    speed: number;
    angle: number;
    isMoving: boolean;
    particles: number;
  } {
    const now = performance.now();
    const elapsed = now - this.lastFrameTime;
    return {
      fps: elapsed > 0 ? Math.round(1000 / elapsed) : 0,
      speed: this.debug.speed,
      angle: this.debug.angle,
      isMoving: this.debug.isMoving,
      particles: this.smokeParticles.length
    };
  }
}
