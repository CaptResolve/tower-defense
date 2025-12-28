// Player.js - Medieval ballista with aiming and shooting

import { GAME_WIDTH, GAME_HEIGHT } from '../engine/Game.js';
import { Projectile } from './Projectile.js';

export class Player {
    constructor(game) {
        this.game = game;

        // Position at bottom center
        this.x = GAME_WIDTH / 2;
        this.y = GAME_HEIGHT - 50;

        // Aiming
        this.aimAngle = -Math.PI / 2; // Start pointing up

        // Base stats (same as basic tower)
        this.baseFireRate = 0.8; // Start same as basic tower
        this.baseDamage = 25;

        // Upgrade levels
        this.fireRateLevel = 1; // 1-10
        this.damageLevel = 1;   // 1-5
        this.maxFireRateLevel = 10;
        this.maxDamageLevel = 5;

        // Current stats (calculated from levels)
        this.fireRate = this.baseFireRate;
        this.damage = this.baseDamage;
        this.projectileSpeed = 700;
        this.lastFireTime = 0;
        this.isFiring = false;

        // Visual
        this.baseRadius = 28;
        this.barrelLength = 50;
        this.barrelWidth = 8;

        // Calculate initial stats
        this.recalculateStats();
    }

    recalculateStats() {
        // Fire rate: Each level reduces fire rate by 8% (faster shooting)
        // Level 1: 0.8s, Level 10: ~0.37s
        this.fireRate = this.baseFireRate * Math.pow(0.92, this.fireRateLevel - 1);

        // Damage: Each level increases damage by 40%
        // Level 1: 25, Level 5: ~96
        this.damage = Math.floor(this.baseDamage * Math.pow(1.4, this.damageLevel - 1));
    }

    upgradeFireRate() {
        if (this.fireRateLevel >= this.maxFireRateLevel) return false;

        const cost = this.game.economy.getPlayerFireRateUpgradeCost(this.fireRateLevel);
        if (!this.game.economy.spendGold(cost)) return false;

        this.fireRateLevel++;
        this.recalculateStats();
        return true;
    }

    upgradeDamage() {
        if (this.damageLevel >= this.maxDamageLevel) return false;

        const cost = this.game.economy.getPlayerDamageUpgradeCost(this.damageLevel);
        if (!this.game.economy.spendGold(cost)) return false;

        this.damageLevel++;
        this.recalculateStats();
        return true;
    }

    update(dt, input) {
        if (!input) return;

        // Update aim angle based on mouse position
        const dx = input.mouseX - this.x;
        const dy = input.mouseY - this.y;
        this.aimAngle = Math.atan2(dy, dx);

        // Clamp aim angle to upper hemisphere
        if (this.aimAngle > 0.3) this.aimAngle = 0.3;
        if (this.aimAngle < Math.PI - 0.3 && this.aimAngle > 0) {
            // Already clamped
        } else if (this.aimAngle > -(Math.PI - 0.3) && this.aimAngle < 0) {
            // Already clamped
        } else if (this.aimAngle < -0.3) {
            // Keep it
        } else if (this.aimAngle >= 0.3 && this.aimAngle <= Math.PI / 2) {
            this.aimAngle = 0.3;
        } else if (this.aimAngle > Math.PI / 2) {
            this.aimAngle = Math.PI - 0.3;
        }

        // Auto-fire while pointer is held
        if (this.isFiring) {
            const now = performance.now() / 1000;
            if (now - this.lastFireTime >= this.fireRate) {
                this.fire();
                this.lastFireTime = now;
            }
        }
    }

    fire() {
        // Calculate projectile spawn position (at ballista tip)
        const spawnX = this.x + Math.cos(this.aimAngle) * this.barrelLength;
        const spawnY = this.y + Math.sin(this.aimAngle) * this.barrelLength;

        const projectile = new Projectile({
            x: spawnX,
            y: spawnY,
            angle: this.aimAngle,
            speed: this.projectileSpeed,
            damage: this.damage,
            owner: 'player',
            color: '#c9a227', // Golden bolt color
            radius: 5,
            glow: true,
            isBolt: true // Medieval bolt projectile
        });

        this.game.projectiles.push(projectile);
    }

    render(ctx, input) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Draw stone foundation
        ctx.fillStyle = '#4a4a4a';
        ctx.beginPath();
        ctx.moveTo(-40, 10);
        ctx.lineTo(-35, -5);
        ctx.lineTo(35, -5);
        ctx.lineTo(40, 10);
        ctx.lineTo(40, 20);
        ctx.lineTo(-40, 20);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Stone texture lines
        ctx.strokeStyle = '#3a3a3a';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-30, 5);
        ctx.lineTo(30, 5);
        ctx.moveTo(-25, 15);
        ctx.lineTo(25, 15);
        ctx.stroke();

        // Draw wooden ballista base
        const woodDark = '#5c4033';
        const woodLight = '#8b6914';
        const woodMid = '#6b4423';

        ctx.save();
        ctx.rotate(this.aimAngle);

        // Ballista frame (wooden arms)
        ctx.fillStyle = woodDark;

        // Left arm
        ctx.beginPath();
        ctx.moveTo(-5, -20);
        ctx.lineTo(15, -25);
        ctx.lineTo(20, -22);
        ctx.lineTo(0, -15);
        ctx.closePath();
        ctx.fill();

        // Right arm
        ctx.beginPath();
        ctx.moveTo(-5, 20);
        ctx.lineTo(15, 25);
        ctx.lineTo(20, 22);
        ctx.lineTo(0, 15);
        ctx.closePath();
        ctx.fill();

        // Bowstring
        ctx.strokeStyle = '#8b7355';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(18, -23);
        ctx.lineTo(8, 0);
        ctx.lineTo(18, 23);
        ctx.stroke();

        // Main ballista rail/barrel
        const railGradient = ctx.createLinearGradient(0, -6, 0, 6);
        railGradient.addColorStop(0, woodLight);
        railGradient.addColorStop(0.5, woodMid);
        railGradient.addColorStop(1, woodDark);
        ctx.fillStyle = railGradient;

        ctx.beginPath();
        ctx.moveTo(0, -6);
        ctx.lineTo(this.barrelLength - 5, -4);
        ctx.lineTo(this.barrelLength, 0);
        ctx.lineTo(this.barrelLength - 5, 4);
        ctx.lineTo(0, 6);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#3d2817';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Metal fittings on rail
        ctx.fillStyle = '#666';
        ctx.fillRect(10, -5, 4, 10);
        ctx.fillRect(25, -4, 3, 8);
        ctx.fillRect(40, -3, 3, 6);

        // Arrow/bolt loaded
        if (!this.isFiring || performance.now() % 200 < 100) {
            ctx.fillStyle = '#c9a227';
            ctx.beginPath();
            ctx.moveTo(this.barrelLength + 5, 0);
            ctx.lineTo(this.barrelLength - 10, -2);
            ctx.lineTo(this.barrelLength - 10, 2);
            ctx.closePath();
            ctx.fill();

            // Arrow shaft
            ctx.fillStyle = '#8b6914';
            ctx.fillRect(5, -1.5, this.barrelLength - 15, 3);

            // Fletching
            ctx.fillStyle = '#8b0000';
            ctx.beginPath();
            ctx.moveTo(5, 0);
            ctx.lineTo(12, -4);
            ctx.lineTo(12, 4);
            ctx.closePath();
            ctx.fill();
        }

        ctx.restore();

        // Draw wooden wheel/base mechanism
        ctx.fillStyle = woodMid;
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#3d2817';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Metal rim
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.stroke();

        // Center metal hub
        ctx.fillStyle = '#444';
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#666';
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, Math.PI * 2);
        ctx.fill();

        // Spokes
        ctx.strokeStyle = woodDark;
        ctx.lineWidth = 3;
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 / 8) * i;
            ctx.beginPath();
            ctx.moveTo(Math.cos(angle) * 6, Math.sin(angle) * 6);
            ctx.lineTo(Math.cos(angle) * 16, Math.sin(angle) * 16);
            ctx.stroke();
        }

        ctx.restore();

        // Draw crosshair at aim position
        if (input) {
            this.renderCrosshair(ctx, input.mouseX, input.mouseY);
        }
    }

    renderCrosshair(ctx, x, y) {
        ctx.save();

        // Don't draw crosshair if too close to player
        const dist = Math.sqrt((x - this.x) ** 2 + (y - this.y) ** 2);
        if (dist < 50) {
            ctx.restore();
            return;
        }

        // Medieval-style crosshair
        ctx.strokeStyle = 'rgba(201, 162, 39, 0.8)';
        ctx.lineWidth = 2;

        // Outer circle with notches
        ctx.beginPath();
        ctx.arc(x, y, 16, 0, Math.PI * 2);
        ctx.stroke();

        // Cross lines
        const lineLen = 22;
        const gap = 10;

        ctx.beginPath();
        ctx.moveTo(x - lineLen, y);
        ctx.lineTo(x - gap, y);
        ctx.moveTo(x + gap, y);
        ctx.lineTo(x + lineLen, y);
        ctx.moveTo(x, y - lineLen);
        ctx.lineTo(x, y - gap);
        ctx.moveTo(x, y + gap);
        ctx.lineTo(x, y + lineLen);
        ctx.stroke();

        // Center diamond
        ctx.fillStyle = 'rgba(201, 162, 39, 0.9)';
        ctx.beginPath();
        ctx.moveTo(x, y - 4);
        ctx.lineTo(x + 4, y);
        ctx.lineTo(x, y + 4);
        ctx.lineTo(x - 4, y);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }
}
