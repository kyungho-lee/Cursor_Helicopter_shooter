import { BULLET, CANVAS_WIDTH } from '../utils/Constants';

export class Bullet {
  public x: number;
  public y: number;
  private active: boolean = true;
  private readonly width = BULLET.WIDTH;
  private readonly height = BULLET.HEIGHT;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  update(deltaTime: number): void {
    this.x += BULLET.SPEED * deltaTime;
    if (this.x > CANVAS_WIDTH) {
      this.active = false;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = '#ffff00';
    ctx.fillRect(this.x, this.y - this.height / 2, this.width, this.height);
  }

  isActive(): boolean {
    return this.active;
  }

  deactivate(): void {
    this.active = false;
  }
}
