// Projectile.js - Projectile class for player and tower bullets

export class Projectile {
    constructor(config = {}) {
        this.x = config.x || 0;
        this.y = config.y || 0;

        // Movement
        this.angle = config.angle || 0;
        this.speed = config.speed || 500;
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;

        // Combat
        this.damage = config.damage || 25;
        this.owner = config.owner || 'player';

        // Visual
        this.radius = config.radius || 5;
        this.color = config.color || '#ffd43b';
        this.glow = config.glow || false;

        // Special effects
        this.splashRadius = config.splashRadius || 0;
        this.slowFactor = config.slowFactor || 0;
        this.piercing = config.piercing || false;

        // State
        this.isDead = false;

        // Trail effect
        this.trail = [];
        this.maxTrailLength = 8;
    }

    update(dt) {
        // Store trail position
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }

        // Move
        this.x += this.vx * dt;
        this.y += this.vy * dt;
    }

    isOffScreen(width, height) {
        return this.x < -50 || this.x > width + 50 ||
               this.y < -50 || this.y > height + 50;
    }

    render(ctx) {
        ctx.save();

        // Render trail
        if (this.trail.length > 1) {
            ctx.beginPath();
            ctx.moveTo(this.trail[0].x, this.trail[0].y);

            for (let i = 1; i < this.trail.length; i++) {
                ctx.lineTo(this.trail[i].x, this.trail[i].y);
            }
            ctx.lineTo(this.x, this.y);

            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.radius * 0.8;
            ctx.lineCap = 'round';
            ctx.globalAlpha = 0.4;
            ctx.stroke();
            ctx.globalAlpha = 1;
        }

        // Glow effect for player projectiles
        if (this.glow) {
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 15;
        }

        // Main projectile body
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        // Inner highlight
        ctx.beginPath();
        ctx.arc(this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fill();

        ctx.restore();
    }
}
