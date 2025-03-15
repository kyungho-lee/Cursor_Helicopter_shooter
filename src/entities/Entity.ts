import { Vector2D } from '../utils/Vector2D';

export abstract class Entity {
  protected x: number;
  protected y: number;
  protected width: number;
  protected height: number;
  protected image: HTMLImageElement;
  protected position: Vector2D;
  protected velocity: Vector2D;
  protected size: Vector2D;
  protected isActive: boolean = true;

  constructor(x: number, y: number, image: HTMLImageElement) {
    this.x = x;
    this.y = y;
    this.image = image;
    this.width = image.width;
    this.height = image.height;
    this.position = new Vector2D(x, y);
    this.velocity = new Vector2D(0, 0);
    this.size = new Vector2D(this.width, this.height);
  }

  public abstract update(deltaTime: number, keys: Record<string, boolean>): void;
  public abstract draw(ctx: CanvasRenderingContext2D): void;

  public isColliding(other: Entity): boolean {
    return (
      this.x < other.x + other.width &&
      this.x + this.width > other.x &&
      this.y < other.y + other.height &&
      this.y + this.height > other.y
    );
  }

  public getPosition(): { x: number; y: number } {
    return { x: this.x, y: this.y };
  }

  public getSize(): { width: number; height: number } {
    return { width: this.width, height: this.height };
  }

  public isActiveEntity(): boolean {
    return this.isActive;
  }

  public deactivate(): void {
    this.isActive = false;
  }

  protected isOutOfBounds(canvasWidth: number, canvasHeight: number): boolean {
    return (
      this.x < 0 ||
      this.x + this.width > canvasWidth ||
      this.y < 0 ||
      this.y + this.height > canvasHeight
    );
  }
} 