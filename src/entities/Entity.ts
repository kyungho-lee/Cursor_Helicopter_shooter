import { Vector2D } from '../utils/Vector2D';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../utils/Constants';

export abstract class Entity {
  protected position: Vector2D;
  protected velocity: Vector2D;
  protected size: Vector2D;
  protected image: HTMLImageElement;
  protected isActive: boolean = true;

  constructor(x: number, y: number, image: HTMLImageElement) {
    this.image = image;
    this.position = new Vector2D(x, y);
    this.velocity = new Vector2D(0, 0);
    this.size = new Vector2D(image.width, image.height);
  }

  public abstract update(deltaTime: number): void;
  public abstract draw(ctx: CanvasRenderingContext2D): void;

  public isColliding(other: Entity): boolean {
    return (
      this.position.x < other.position.x + other.size.x &&
      this.position.x + this.size.x > other.position.x &&
      this.position.y < other.position.y + other.size.y &&
      this.position.y + this.size.y > other.position.y
    );
  }

  public getPosition(): Vector2D {
    return this.position;
  }

  public getSize(): Vector2D {
    return this.size;
  }

  public isActiveEntity(): boolean {
    return this.isActive;
  }

  public deactivate(): void {
    this.isActive = false;
  }

  protected isOutOfBounds(): boolean {
    return (
      this.position.x < 0 ||
      this.position.x + this.size.x > CANVAS_WIDTH ||
      this.position.y < 0 ||
      this.position.y + this.size.y > CANVAS_HEIGHT
    );
  }
}
