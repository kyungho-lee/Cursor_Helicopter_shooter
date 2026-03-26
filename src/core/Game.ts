import { Player } from '../entities/Player';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../utils/Constants';

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private isRunning: boolean = false;
  private lastTime: number = 0;
  private player!: Player;
  private debugPanel: {
    fps: HTMLElement;
    speed: HTMLElement;
    angle: HTMLElement;
    engine: HTMLElement;
    particles: HTMLElement;
  };

  constructor() {
    this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.debugPanel = {
      fps: document.getElementById('fps')!,
      speed: document.getElementById('speed')!,
      angle: document.getElementById('angle')!,
      engine: document.getElementById('engine')!,
      particles: document.getElementById('particles')!,
    };
    this.init();
  }

  private init(): void {
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;
  }

  public async start(): Promise<void> {
    if (this.isRunning) return;

    await this.loadAssets();
    this.isRunning = true;
    this.lastTime = performance.now();
    this.gameLoop();
  }

  private async loadAssets(): Promise<void> {
    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
        img.src = src;
      });
    };

    const [helicopterImage, propellerImage] = await Promise.all([
      loadImage('/assets/helicopter.png'),
      loadImage('/assets/propeller.png'),
    ]);

    this.player = new Player(
      CANVAS_WIDTH / 2 - 25,
      CANVAS_HEIGHT / 2 - 25,
      helicopterImage,
      propellerImage
    );
  }

  private gameLoop(): void {
    if (!this.isRunning) return;

    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    this.update(deltaTime);
    this.render();
    this.updateDebugPanel();

    requestAnimationFrame(() => this.gameLoop());
  }

  private update(deltaTime: number): void {
    this.player.update(deltaTime);
  }

  private render(): void {
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.player.draw(this.ctx);
  }

  private updateDebugPanel(): void {
    const debug = this.player.getDebugInfo();
    this.debugPanel.fps.textContent = debug.fps.toString();
    this.debugPanel.speed.textContent = debug.speed.toString();
    this.debugPanel.angle.textContent = `${debug.angle}°`;
    this.debugPanel.engine.textContent = debug.isMoving ? 'ON' : 'OFF';
    this.debugPanel.particles.textContent = debug.particles.toString();
  }
}
