import { Player } from '../entities/Player';
import { InputManager } from './InputManager';

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private isRunning: boolean = false;
  private lastTime: number = 0;
  private player: Player;
  private inputManager: InputManager;

  constructor() {
    this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.inputManager = InputManager.getInstance();
    this.init();
  }

  private init(): void {
    // 캔버스 크기 설정
    this.canvas.width = 800;
    this.canvas.height = 600;

    // 플레이어 초기화
    this.player = new Player(
      this.canvas.width / 2 - 32,
      this.canvas.height - 100
    );
  }

  public start(): void {
    if (!this.isRunning) {
      this.isRunning = true;
      this.lastTime = performance.now();
      this.gameLoop();
    }
  }

  private gameLoop(): void {
    if (!this.isRunning) return;

    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) / 1000; // 초 단위로 변환
    this.lastTime = currentTime;

    // 게임 상태 업데이트
    this.update(deltaTime);
    // 화면 렌더링
    this.render();

    requestAnimationFrame(() => this.gameLoop());
  }

  private update(deltaTime: number): void {
    this.player.update(deltaTime);
  }

  private render(): void {
    // 화면 클리어
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // 게임 오브젝트 렌더링
    this.player.render(this.ctx);
  }
} 