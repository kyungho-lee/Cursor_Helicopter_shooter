import { MISSILE, CANVAS_WIDTH, CANVAS_HEIGHT } from '../utils/Constants';

export class Missile {
  public x: number;
  public y: number;
  private velocityX: number = MISSILE.SPEED;
  private velocityY: number = 0;
  private angle: number = 0;
  private active: boolean = true;
  private readonly width = MISSILE.WIDTH;
  private readonly height = MISSILE.HEIGHT;
  // 미사일 화염 애니메이션
  private flameTimer: number = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  update(deltaTime: number): void {
    // TODO v0.4.0: 가장 가까운 적을 향해 MISSILE.TURN_SPEED로 방향 전환
    this.x += this.velocityX * deltaTime;
    this.y += this.velocityY * deltaTime;
    this.flameTimer += deltaTime;

    if (
      this.x > CANVAS_WIDTH ||
      this.x < 0 ||
      this.y < 0 ||
      this.y > CANVAS_HEIGHT
    ) {
      this.active = false;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // 미사일 몸체
    ctx.fillStyle = '#cc4400';
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

    // 미사일 뾰족한 앞부분
    ctx.fillStyle = '#ffaa00';
    ctx.beginPath();
    ctx.moveTo(this.width / 2, 0);
    ctx.lineTo(this.width / 2 + 6, 0);
    ctx.lineTo(this.width / 2, -this.height / 4);
    ctx.closePath();
    ctx.fill();

    // 화염 (깜빡임 효과)
    const flameOpacity = 0.6 + Math.sin(this.flameTimer * 20) * 0.4;
    ctx.globalAlpha = flameOpacity;
    ctx.fillStyle = '#ff6600';
    ctx.fillRect(-this.width / 2 - 8, -this.height / 4, 8, this.height / 2);

    ctx.restore();
  }

  isActive(): boolean {
    return this.active;
  }

  deactivate(): void {
    this.active = false;
  }
}
