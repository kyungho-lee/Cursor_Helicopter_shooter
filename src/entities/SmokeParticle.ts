import { SMOKE } from '../constants/PhysicsConstants';

export class SmokeParticle {
    private x: number;
    private y: number;
    private size: number;
    private alpha: number;
    private lifetime: number;
    private velocityX: number;
    private velocityY: number;

    constructor(x: number, y: number, lifetime: number) {
        this.x = x;
        this.y = y;
        this.size = SMOKE.MIN_SIZE + Math.random() * (SMOKE.MAX_SIZE - SMOKE.MIN_SIZE);
        this.alpha = 1.0;
        this.lifetime = lifetime;

        // 랜덤한 방향으로 이동
        const angle = Math.random() * Math.PI * 2;
        this.velocityX = Math.cos(angle) * SMOKE.SPEED;
        this.velocityY = Math.sin(angle) * SMOKE.SPEED;
    }

    update(deltaTime: number): void {
        // 위치 업데이트
        this.x += this.velocityX * deltaTime;
        this.y += this.velocityY * deltaTime;

        // 크기 증가
        this.size += deltaTime;

        // 투명도 감소
        this.alpha -= SMOKE.ALPHA_DECAY * deltaTime;
        
        // 수명 감소
        this.lifetime -= deltaTime;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.fillStyle = `rgba(100, 100, 100, ${this.alpha})`;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    isAlive(): boolean {
        return this.lifetime > 0 && this.alpha > 0;
    }
} 