import { Player } from './entities/Player';
import { InputManager } from './core/InputManager';
import { Game } from './Game';

class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private player: Player;
    private lastTime: number = 0;
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
        this.setupCanvas();
        this.loadAssets().then(() => {
            this.initialize();
            this.gameLoop();
        });
    }

    private setupCanvas(): void {
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.debugPanel = {
            fps: document.getElementById('fps')!,
            speed: document.getElementById('speed')!,
            angle: document.getElementById('angle')!,
            engine: document.getElementById('engine')!,
            particles: document.getElementById('particles')!
        };
    }

    private async loadAssets(): Promise<void> {
        const loadImage = (src: string): Promise<HTMLImageElement> => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.src = src;
            });
        };

        const [helicopterImage, propellerImage] = await Promise.all([
            loadImage('/assets/helicopter.png'),
            loadImage('/assets/propeller.png')
        ]);

        this.player = new Player(
            this.canvas.width / 2 - 25,
            this.canvas.height / 2 - 25,
            helicopterImage,
            propellerImage
        );
    }

    private initialize(): void {
        // 게임 초기화 로직
    }

    private updateDebugPanel(): void {
        const debug = this.player.getDebugInfo();
        this.debugPanel.fps.textContent = debug.fps.toString();
        this.debugPanel.speed.textContent = debug.speed.toString();
        this.debugPanel.angle.textContent = `${debug.angle}°`;
        this.debugPanel.engine.textContent = debug.isMoving ? 'ON' : 'OFF';
        this.debugPanel.particles.textContent = debug.particles.toString();
    }

    private gameLoop(currentTime: number = 0): void {
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        // 화면 클리어
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 게임 업데이트
        this.player.update(deltaTime);

        // 렌더링
        this.player.draw(this.ctx);

        // 디버그 정보 업데이트
        this.updateDebugPanel();

        // 다음 프레임 요청
        requestAnimationFrame((time) => this.gameLoop(time));
    }
}

// 게임 시작
window.addEventListener('load', () => {
    const game = new Game();
    game.start();
}); 