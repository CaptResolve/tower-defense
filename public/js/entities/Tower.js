// Tower.js - Medieval castle tower base class and tower types

import { Projectile } from './Projectile.js';

// Tower base class
export class Tower {
    constructor(x, y, config = {}) {
        this.x = x;
        this.y = y;

        // Stats
        this.type = config.type || 'basic';
        this.range = config.range || 150;
        this.fireRate = config.fireRate || 1.0;
        this.damage = config.damage || 50;
        this.projectileSpeed = config.projectileSpeed || 500;

        // Hill bonus - towers on hills get +20% range
        this.onHill = config.onHill || false;
        this.hillBonus = this.onHill ? 1.2 : 1.0;

        // State
        this.level = 1;
        this.maxLevel = 3;
        this.lastFireTime = 0;
        this.target = null;
        this.angle = 0;

        // Visual - Medieval colors
        this.stoneLight = config.stoneLight || '#a0937d';
        this.stoneMid = config.stoneMid || '#8b7d6b';
        this.stoneDark = config.stoneDark || '#5c524a';
        this.accentColor = config.accentColor || '#4a6741';
    }

    // Get effective range (base range * hill bonus)
    getEffectiveRange() {
        return this.range * this.hillBonus;
    }

    update(dt, enemies, game) {
        // Find target (closest enemy in range)
        this.target = this.findTarget(enemies);

        if (this.target) {
            // Rotate toward target
            const dx = this.target.x - this.x;
            const dy = this.target.y - this.y;
            const targetAngle = Math.atan2(dy, dx);

            // Smooth rotation
            let angleDiff = targetAngle - this.angle;
            while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
            while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
            this.angle += angleDiff * Math.min(dt * 10, 1);

            // Fire if ready
            const now = performance.now() / 1000;
            if (now - this.lastFireTime >= this.fireRate) {
                this.fire(game);
                this.lastFireTime = now;
            }
        }
    }

    findTarget(enemies) {
        let closest = null;
        let closestDist = this.getEffectiveRange();

        for (const enemy of enemies) {
            if (enemy.isDead) continue;

            const dx = enemy.x - this.x;
            const dy = enemy.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < closestDist) {
                closestDist = dist;
                closest = enemy;
            }
        }

        return closest;
    }

    fire(game) {
        const spawnX = this.x + Math.cos(this.angle) * 25;
        const spawnY = this.y + Math.sin(this.angle) * 25;

        const projectile = new Projectile({
            x: spawnX,
            y: spawnY,
            angle: this.angle,
            speed: this.projectileSpeed,
            damage: this.damage,
            owner: 'tower',
            color: '#8b6914',
            radius: 4
        });

        game.projectiles.push(projectile);
    }

    upgrade() {
        if (this.level >= this.maxLevel) return false;

        this.level++;
        this.damage = Math.floor(this.damage * 1.4);
        this.range = Math.floor(this.range * 1.1);
        this.fireRate = this.fireRate * 0.85;

        return true;
    }

    render(ctx, isSelected) {
        this.renderCastleTower(ctx, isSelected);
    }

    renderCastleTower(ctx, isSelected) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Draw range circle when selected (use effective range with hill bonus)
        if (isSelected) {
            const effectiveRange = this.getEffectiveRange();
            ctx.beginPath();
            ctx.arc(0, 0, effectiveRange, 0, Math.PI * 2);
            // Green tint if on hill to show bonus
            if (this.onHill) {
                ctx.fillStyle = 'rgba(100, 200, 100, 0.15)';
                ctx.fill();
                ctx.strokeStyle = 'rgba(100, 200, 100, 0.5)';
            } else {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.fill();
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            }
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Tower base dimensions based on level
        const baseWidth = 36 + this.level * 2;
        const baseHeight = 40 + this.level * 8;

        // Stone foundation
        ctx.fillStyle = this.stoneDark;
        ctx.fillRect(-baseWidth/2 - 2, -5, baseWidth + 4, 15);

        // Main tower body
        const bodyGradient = ctx.createLinearGradient(-baseWidth/2, 0, baseWidth/2, 0);
        bodyGradient.addColorStop(0, this.stoneDark);
        bodyGradient.addColorStop(0.3, this.stoneMid);
        bodyGradient.addColorStop(0.7, this.stoneLight);
        bodyGradient.addColorStop(1, this.stoneMid);
        ctx.fillStyle = bodyGradient;
        ctx.fillRect(-baseWidth/2, -baseHeight, baseWidth, baseHeight);

        // Stone brick lines
        ctx.strokeStyle = this.stoneDark;
        ctx.lineWidth = 1;
        for (let row = 0; row < baseHeight / 10; row++) {
            const y = -baseHeight + row * 10;
            ctx.beginPath();
            ctx.moveTo(-baseWidth/2, y);
            ctx.lineTo(baseWidth/2, y);
            ctx.stroke();

            // Vertical brick lines (offset every other row)
            const offset = (row % 2) * 8;
            for (let col = -baseWidth/2 + offset; col < baseWidth/2; col += 16) {
                ctx.beginPath();
                ctx.moveTo(col, y);
                ctx.lineTo(col, y + 10);
                ctx.stroke();
            }
        }

        // Tower outline
        ctx.strokeStyle = isSelected ? '#fff' : this.stoneDark;
        ctx.lineWidth = isSelected ? 3 : 2;
        ctx.strokeRect(-baseWidth/2, -baseHeight, baseWidth, baseHeight);

        // Crenellations (battlements) - more at higher levels
        const merlonCount = 2 + this.level;
        const merlonWidth = baseWidth / merlonCount;
        ctx.fillStyle = this.stoneMid;
        for (let i = 0; i < merlonCount; i++) {
            if (i % 2 === 0) {
                const merlonX = -baseWidth/2 + i * merlonWidth;
                ctx.fillRect(merlonX, -baseHeight - 8, merlonWidth, 8);
                ctx.strokeStyle = this.stoneDark;
                ctx.lineWidth = 1;
                ctx.strokeRect(merlonX, -baseHeight - 8, merlonWidth, 8);
            }
        }

        // Arrow slit windows - more at higher levels
        ctx.fillStyle = '#1a1a1a';
        const windowCount = this.level;
        for (let i = 0; i < windowCount; i++) {
            const windowY = -baseHeight + 15 + i * 15;
            ctx.fillRect(-2, windowY, 4, 10);
        }

        // Banner/flag at level 2+
        if (this.level >= 2) {
            this.renderBanner(ctx, -baseWidth/2 - 5, -baseHeight - 8);
        }

        // Crown/decoration at level 3
        if (this.level >= 3) {
            this.renderCrown(ctx, 0, -baseHeight - 15);
        }

        // Archer/weapon platform - rotates to aim
        ctx.save();
        ctx.translate(0, -baseHeight + 5);
        ctx.rotate(this.angle);

        // Weapon platform
        ctx.fillStyle = '#5c4033';
        ctx.fillRect(-5, -4, 30, 8);

        // Crossbow/bow
        ctx.strokeStyle = '#3d2817';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(20, -6);
        ctx.lineTo(15, 0);
        ctx.lineTo(20, 6);
        ctx.stroke();

        ctx.restore();

        ctx.restore();

        // Level indicator stars
        ctx.fillStyle = '#ffd43b';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        const stars = '\u2605'.repeat(this.level);
        ctx.fillText(stars, this.x, this.y + 18);
    }

    renderBanner(ctx, x, y) {
        // Flag pole
        ctx.fillStyle = '#3d2817';
        ctx.fillRect(x, y, 3, -20);

        // Banner
        ctx.fillStyle = this.accentColor;
        ctx.beginPath();
        ctx.moveTo(x + 3, y - 20);
        ctx.lineTo(x + 18, y - 17);
        ctx.lineTo(x + 15, y - 12);
        ctx.lineTo(x + 18, y - 7);
        ctx.lineTo(x + 3, y - 4);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#2a3a24';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    renderCrown(ctx, x, y) {
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.moveTo(x - 8, y + 5);
        ctx.lineTo(x - 8, y);
        ctx.lineTo(x - 5, y + 3);
        ctx.lineTo(x, y - 3);
        ctx.lineTo(x + 5, y + 3);
        ctx.lineTo(x + 8, y);
        ctx.lineTo(x + 8, y + 5);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#b8860b';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

// Guard Tower (Basic) - Simple stone archer tower
export class BasicTower extends Tower {
    constructor(x, y, options = {}) {
        super(x, y, {
            type: 'basic',
            range: 150,
            fireRate: 0.8,
            damage: 40,
            projectileSpeed: 500,
            stoneLight: '#a0937d',
            stoneMid: '#8b7d6b',
            stoneDark: '#5c524a',
            accentColor: '#4a6741', // Green banner
            onHill: options.onHill || false
        });
        this.cost = 100;
    }
}

// Watchtower (Sniper) - Tall stone tower with long range
export class SniperTower extends Tower {
    constructor(x, y, options = {}) {
        super(x, y, {
            type: 'sniper',
            range: 280,
            fireRate: 2.0,
            damage: 120,
            projectileSpeed: 900,
            stoneLight: '#b8a898',
            stoneMid: '#9c8b7a',
            stoneDark: '#6b5d52',
            accentColor: '#2d4a6b', // Blue banner
            onHill: options.onHill || false
        });
        this.cost = 200;
    }

    render(ctx, isSelected) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Draw range circle when selected (use effective range with hill bonus)
        if (isSelected) {
            const effectiveRange = this.getEffectiveRange();
            ctx.beginPath();
            ctx.arc(0, 0, effectiveRange, 0, Math.PI * 2);
            if (this.onHill) {
                ctx.fillStyle = 'rgba(100, 200, 100, 0.15)';
                ctx.fill();
                ctx.strokeStyle = 'rgba(100, 200, 100, 0.5)';
            } else {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.fill();
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            }
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Taller, narrower tower
        const baseWidth = 28 + this.level * 2;
        const baseHeight = 55 + this.level * 10;

        // Stone foundation
        ctx.fillStyle = this.stoneDark;
        ctx.fillRect(-baseWidth/2 - 3, -5, baseWidth + 6, 18);

        // Main tower body - tapers upward
        ctx.fillStyle = this.stoneMid;
        ctx.beginPath();
        ctx.moveTo(-baseWidth/2, 0);
        ctx.lineTo(-baseWidth/2 + 4, -baseHeight);
        ctx.lineTo(baseWidth/2 - 4, -baseHeight);
        ctx.lineTo(baseWidth/2, 0);
        ctx.closePath();
        ctx.fill();

        // Brick texture
        ctx.strokeStyle = this.stoneDark;
        ctx.lineWidth = 1;
        for (let row = 0; row < baseHeight / 8; row++) {
            const y = -row * 8;
            const taper = row * 0.3;
            ctx.beginPath();
            ctx.moveTo(-baseWidth/2 + taper, y);
            ctx.lineTo(baseWidth/2 - taper, y);
            ctx.stroke();
        }

        // Outline
        ctx.strokeStyle = isSelected ? '#fff' : this.stoneDark;
        ctx.lineWidth = isSelected ? 3 : 2;
        ctx.beginPath();
        ctx.moveTo(-baseWidth/2, 0);
        ctx.lineTo(-baseWidth/2 + 4, -baseHeight);
        ctx.lineTo(baseWidth/2 - 4, -baseHeight);
        ctx.lineTo(baseWidth/2, 0);
        ctx.closePath();
        ctx.stroke();

        // Pointed roof at level 2+
        if (this.level >= 2) {
            ctx.fillStyle = '#4a3728';
            ctx.beginPath();
            ctx.moveTo(-baseWidth/2 + 2, -baseHeight);
            ctx.lineTo(0, -baseHeight - 20);
            ctx.lineTo(baseWidth/2 - 2, -baseHeight);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#3d2817';
            ctx.stroke();
        }

        // Crown at level 3
        if (this.level >= 3) {
            this.renderCrown(ctx, 0, -baseHeight - 25);
        }

        // Observation window
        ctx.fillStyle = '#1a1a1a';
        ctx.beginPath();
        ctx.arc(0, -baseHeight + 12, 5, 0, Math.PI * 2);
        ctx.fill();

        // Crossbow platform
        ctx.save();
        ctx.translate(0, -baseHeight + 15);
        ctx.rotate(this.angle);

        ctx.fillStyle = '#5c4033';
        ctx.fillRect(-3, -3, 35, 6);

        // Long crossbow
        ctx.strokeStyle = '#3d2817';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(28, -5);
        ctx.lineTo(22, 0);
        ctx.lineTo(28, 5);
        ctx.stroke();

        ctx.restore();

        ctx.restore();

        // Level stars
        ctx.fillStyle = '#ffd43b';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('\u2605'.repeat(this.level), this.x, this.y + 18);
    }
}

// Siege Tower (Splash) - Catapult/trebuchet style
export class SplashTower extends Tower {
    constructor(x, y, options = {}) {
        super(x, y, {
            type: 'splash',
            range: 120,
            fireRate: 1.5,
            damage: 35,
            projectileSpeed: 400,
            stoneLight: '#b09080',
            stoneMid: '#8b7060',
            stoneDark: '#5c4540',
            accentColor: '#8b4513', // Brown/orange banner
            onHill: options.onHill || false
        });
        this.cost = 175;
        this.splashRadius = 60;
    }

    fire(game) {
        const spawnX = this.x + Math.cos(this.angle) * 20;
        const spawnY = this.y + Math.sin(this.angle) * 20;

        const projectile = new Projectile({
            x: spawnX,
            y: spawnY,
            angle: this.angle,
            speed: this.projectileSpeed,
            damage: this.damage,
            owner: 'tower',
            color: '#ff6b35',
            radius: 8,
            splashRadius: this.splashRadius * (1 + (this.level - 1) * 0.2)
        });

        game.projectiles.push(projectile);
    }

    render(ctx, isSelected) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Draw range circle when selected (use effective range with hill bonus)
        if (isSelected) {
            const effectiveRange = this.getEffectiveRange();
            ctx.beginPath();
            ctx.arc(0, 0, effectiveRange, 0, Math.PI * 2);
            if (this.onHill) {
                ctx.fillStyle = 'rgba(100, 200, 100, 0.15)';
                ctx.fill();
                ctx.strokeStyle = 'rgba(100, 200, 100, 0.5)';
            } else {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.fill();
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            }
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Wider, shorter base
        const baseWidth = 44 + this.level * 4;
        const baseHeight = 30 + this.level * 5;

        // Stone platform
        ctx.fillStyle = this.stoneMid;
        ctx.fillRect(-baseWidth/2, -baseHeight, baseWidth, baseHeight);

        // Brick texture
        ctx.strokeStyle = this.stoneDark;
        ctx.lineWidth = 1;
        for (let row = 0; row < 4; row++) {
            const y = -baseHeight + row * 10;
            ctx.beginPath();
            ctx.moveTo(-baseWidth/2, y);
            ctx.lineTo(baseWidth/2, y);
            ctx.stroke();
        }

        // Outline
        ctx.strokeStyle = isSelected ? '#fff' : this.stoneDark;
        ctx.lineWidth = isSelected ? 3 : 2;
        ctx.strokeRect(-baseWidth/2, -baseHeight, baseWidth, baseHeight);

        // Crenellations
        const merlonCount = 3 + this.level;
        const merlonWidth = baseWidth / merlonCount;
        ctx.fillStyle = this.stoneMid;
        for (let i = 0; i < merlonCount; i++) {
            if (i % 2 === 0) {
                ctx.fillRect(-baseWidth/2 + i * merlonWidth, -baseHeight - 6, merlonWidth, 6);
            }
        }

        // Catapult arm
        ctx.save();
        ctx.translate(0, -baseHeight - 5);
        ctx.rotate(this.angle + Math.PI / 6);

        // Wooden frame
        ctx.fillStyle = '#5c4033';
        ctx.fillRect(-5, -3, 8, 6);

        // Arm
        ctx.fillStyle = '#6b4423';
        ctx.fillRect(0, -2, 28 + this.level * 3, 4);

        // Bucket/sling
        ctx.fillStyle = '#4a3020';
        ctx.beginPath();
        ctx.arc(26 + this.level * 3, 0, 6, 0, Math.PI * 2);
        ctx.fill();

        // Projectile in bucket
        ctx.fillStyle = '#ff6b35';
        ctx.beginPath();
        ctx.arc(26 + this.level * 3, 0, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // Decorations at higher levels
        if (this.level >= 2) {
            this.renderBanner(ctx, -baseWidth/2 - 3, -baseHeight);
        }

        if (this.level >= 3) {
            // Fire pots decoration
            ctx.fillStyle = '#ff6b35';
            ctx.beginPath();
            ctx.arc(-10, -baseHeight + 10, 4, 0, Math.PI * 2);
            ctx.arc(10, -baseHeight + 10, 4, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();

        // Level stars
        ctx.fillStyle = '#ffd43b';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('\u2605'.repeat(this.level), this.x, this.y + 18);
    }
}

// Mage Tower (Slow) - Mystical tower with crystal
export class SlowTower extends Tower {
    constructor(x, y, options = {}) {
        super(x, y, {
            type: 'slow',
            range: 130,
            fireRate: 0.5,
            damage: 15,
            projectileSpeed: 600,
            stoneLight: '#9090a0',
            stoneMid: '#706080',
            stoneDark: '#4a4060',
            accentColor: '#6b4a9c', // Purple banner
            onHill: options.onHill || false
        });
        this.cost = 125;
        this.slowFactor = 0.4;
        this.crystalPulse = 0;
    }

    fire(game) {
        const spawnX = this.x + Math.cos(this.angle) * 22;
        const spawnY = this.y + Math.sin(this.angle) * 22;

        const projectile = new Projectile({
            x: spawnX,
            y: spawnY,
            angle: this.angle,
            speed: this.projectileSpeed,
            damage: this.damage,
            owner: 'tower',
            color: '#88ccff',
            radius: 5,
            slowFactor: this.slowFactor - (this.level - 1) * 0.1,
            glow: true
        });

        game.projectiles.push(projectile);
    }

    update(dt, enemies, game) {
        super.update(dt, enemies, game);
        this.crystalPulse += dt * 3;
    }

    render(ctx, isSelected) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Draw range circle when selected (use effective range with hill bonus)
        if (isSelected) {
            const effectiveRange = this.getEffectiveRange();
            ctx.beginPath();
            ctx.arc(0, 0, effectiveRange, 0, Math.PI * 2);
            if (this.onHill) {
                ctx.fillStyle = 'rgba(100, 200, 100, 0.15)';
                ctx.fill();
                ctx.strokeStyle = 'rgba(100, 200, 100, 0.5)';
            } else {
                ctx.fillStyle = 'rgba(136, 204, 255, 0.15)';
                ctx.fill();
                ctx.strokeStyle = 'rgba(136, 204, 255, 0.5)';
            }
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Mystical round tower
        const baseRadius = 18 + this.level * 2;
        const baseHeight = 45 + this.level * 8;

        // Stone foundation
        ctx.fillStyle = this.stoneDark;
        ctx.beginPath();
        ctx.ellipse(0, 5, baseRadius + 3, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Main tower body (cylinder effect)
        const bodyGradient = ctx.createLinearGradient(-baseRadius, 0, baseRadius, 0);
        bodyGradient.addColorStop(0, this.stoneDark);
        bodyGradient.addColorStop(0.3, this.stoneMid);
        bodyGradient.addColorStop(0.7, this.stoneLight);
        bodyGradient.addColorStop(1, this.stoneDark);
        ctx.fillStyle = bodyGradient;
        ctx.fillRect(-baseRadius, -baseHeight, baseRadius * 2, baseHeight);

        // Curved top
        ctx.beginPath();
        ctx.ellipse(0, -baseHeight, baseRadius, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Brick lines (curved)
        ctx.strokeStyle = this.stoneDark;
        ctx.lineWidth = 1;
        for (let row = 0; row < baseHeight / 12; row++) {
            const y = -baseHeight + row * 12 + 6;
            ctx.beginPath();
            ctx.moveTo(-baseRadius, y);
            ctx.lineTo(baseRadius, y);
            ctx.stroke();
        }

        // Outline
        ctx.strokeStyle = isSelected ? '#fff' : this.stoneDark;
        ctx.lineWidth = isSelected ? 3 : 2;
        ctx.strokeRect(-baseRadius, -baseHeight, baseRadius * 2, baseHeight);

        // Mystical window
        ctx.fillStyle = '#1a1a3a';
        ctx.beginPath();
        ctx.moveTo(0, -baseHeight + 15);
        ctx.lineTo(-5, -baseHeight + 25);
        ctx.lineTo(-5, -baseHeight + 35);
        ctx.lineTo(5, -baseHeight + 35);
        ctx.lineTo(5, -baseHeight + 25);
        ctx.closePath();
        ctx.fill();

        // Window glow
        ctx.fillStyle = `rgba(136, 204, 255, ${0.3 + Math.sin(this.crystalPulse) * 0.2})`;
        ctx.fill();

        // Crystal on top
        const crystalHeight = 12 + this.level * 3;
        const crystalGlow = 0.5 + Math.sin(this.crystalPulse) * 0.3;

        // Crystal glow aura
        ctx.shadowColor = '#88ccff';
        ctx.shadowBlur = 15 * crystalGlow;

        // Crystal shape
        ctx.fillStyle = '#88ccff';
        ctx.beginPath();
        ctx.moveTo(0, -baseHeight - crystalHeight);
        ctx.lineTo(-6, -baseHeight - 5);
        ctx.lineTo(0, -baseHeight - 2);
        ctx.lineTo(6, -baseHeight - 5);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#aaddff';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.shadowBlur = 0;

        // Runes at level 2+
        if (this.level >= 2) {
            ctx.fillStyle = `rgba(136, 204, 255, ${0.5 + Math.sin(this.crystalPulse + 1) * 0.3})`;
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('\u2726', -8, -baseHeight + 48);
            ctx.fillText('\u2726', 8, -baseHeight + 48);
        }

        // Floating particles at level 3
        if (this.level >= 3) {
            ctx.fillStyle = `rgba(136, 204, 255, ${0.6})`;
            for (let i = 0; i < 3; i++) {
                const angle = this.crystalPulse + i * (Math.PI * 2 / 3);
                const px = Math.cos(angle) * 15;
                const py = -baseHeight - 10 + Math.sin(angle * 2) * 5;
                ctx.beginPath();
                ctx.arc(px, py, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Aiming indicator (subtle)
        ctx.save();
        ctx.translate(0, -baseHeight + 5);
        ctx.rotate(this.angle);
        ctx.strokeStyle = `rgba(136, 204, 255, 0.5)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(10, 0);
        ctx.lineTo(20, 0);
        ctx.stroke();
        ctx.restore();

        ctx.restore();

        // Level stars
        ctx.fillStyle = '#ffd43b';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('\u2605'.repeat(this.level), this.x, this.y + 18);
    }
}

// Export tower classes map for easy access
export const TowerClasses = {
    basic: BasicTower,
    sniper: SniperTower,
    splash: SplashTower,
    slow: SlowTower
};
