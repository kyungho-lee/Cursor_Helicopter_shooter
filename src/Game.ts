import { CANVAS_WIDTH, CANVAS_HEIGHT } from './utils/Constants';
import { Player } from './entities/Player';

export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private player: Player;
    private lastTime: number = 0;
    private isRunning: boolean = false;

    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = CANVAS_WIDTH;
        this.canvas.height = CANVAS_HEIGHT;
        document.body.appendChild(this.canvas);

        const context = this.canvas.getContext('2d');
        if (!context) {
            throw new Error('Failed to get 2D context');
        }
        this.ctx = context;

        // 플레이어 초기화
        this.player = new Player(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);

        // 이벤트 리스너 설정
        window.addEventListener('keydown', (e) => this.player.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.player.handleKeyUp(e));
    }

    start(): void {
        if (!this.isRunning) {
            this.isRunning = true;
            this.lastTime = performance.now();
            requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
        }
    }

    private gameLoop(currentTime: number): void {
        if (!this.isRunning) return;

        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        this.update(deltaTime);
        this.draw();

        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    private update(deltaTime: number): void {
        this.player.update(deltaTime);
    }

    private draw(): void {
        // 화면 클리어
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 플레이어 그리기
        this.player.draw(this.ctx);
    }
} 