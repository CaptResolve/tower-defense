// Enemy.js - Medieval enemy base class and enemy types

// Enemy base class
export class Enemy {
    constructor(config = {}) {
        this.path = config.path || [];
        this.pathIndex = 0;

        // Start at first path point
        if (this.path.length > 0) {
            this.x = this.path[0].x;
            this.y = this.path[0].y;
        } else {
            this.x = 0;
            this.y = 0;
        }

        // Stats
        this.health = config.health || 100;
        this.maxHealth = this.health;
        this.speed = config.speed || 80;
        this.baseSpeed = this.speed;
        this.reward = config.reward || 10;
        this.damage = config.damage || 1;

        // Visual
        this.radius = config.radius || 15;
        this.color = config.color || '#8b4513';
        this.secondaryColor = config.secondaryColor || '#5c3317';

        // State
        this.isDead = false;
        this.reachedEnd = false;
        this.slowTimer = 0;
        this.slowFactor = 1;

        // Animation
        this.animTime = Math.random() * Math.PI * 2;
        this.walkCycle = 0;
    }

    update(dt) {
        if (this.isDead || this.reachedEnd) return;

        // Update slow effect
        if (this.slowTimer > 0) {
            this.slowTimer -= dt;
            if (this.slowTimer <= 0) {
                this.speed = this.baseSpeed;
                this.slowFactor = 1;
            }
        }

        // Animation time
        this.animTime += dt * 5;
        this.walkCycle += dt * this.speed * 0.05;

        // Move toward next waypoint
        if (this.pathIndex >= this.path.length) {
            this.reachedEnd = true;
            return;
        }

        const target = this.path[this.pathIndex];
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 5) {
            // Reached waypoint
            this.pathIndex++;
            if (this.pathIndex >= this.path.length) {
                this.reachedEnd = true;
            }
        } else {
            // Move toward waypoint
            const moveX = (dx / dist) * this.speed * dt;
            const moveY = (dy / dist) * this.speed * dt;
            this.x += moveX;
            this.y += moveY;
        }
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            this.isDead = true;
        }
    }

    applySlow(factor, duration) {
        // Apply stronger slow if new one is better
        if (factor < this.slowFactor || this.slowTimer <= 0) {
            this.slowFactor = factor;
            this.speed = this.baseSpeed * factor;
        }
        this.slowTimer = Math.max(this.slowTimer, duration);
    }

    render(ctx) {
        if (this.isDead) return;

        ctx.save();
        ctx.translate(this.x, this.y);

        // Slow effect visual (frost)
        if (this.slowTimer > 0) {
            ctx.beginPath();
            ctx.arc(0, 0, this.radius + 5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(136, 204, 255, 0.3)';
            ctx.fill();
        }

        // Draw body
        this.renderBody(ctx);

        // Health bar
        this.renderHealthBar(ctx);

        ctx.restore();
    }

    renderBody(ctx) {
        // Default medieval soldier body
        const bounce = Math.sin(this.walkCycle) * 2;

        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(0, this.radius - 2, this.radius * 0.8, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Body (tunic)
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(-8, -2 + bounce);
        ctx.lineTo(-10, 10);
        ctx.lineTo(10, 10);
        ctx.lineTo(8, -2 + bounce);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = this.secondaryColor;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Head
        ctx.fillStyle = '#deb887';
        ctx.beginPath();
        ctx.arc(0, -8 + bounce, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#c4a06a';
        ctx.stroke();

        // Simple helmet
        ctx.fillStyle = '#666';
        ctx.beginPath();
        ctx.arc(0, -10 + bounce, 6, Math.PI, 0);
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#000';
        ctx.fillRect(-3, -9 + bounce, 2, 2);
        ctx.fillRect(1, -9 + bounce, 2, 2);
    }

    renderHealthBar(ctx) {
        const width = 26;
        const height = 4;
        const y = -this.radius - 12;

        // Background
        ctx.fillStyle = '#333';
        ctx.fillRect(-width / 2, y, width, height);

        // Health
        const healthPercent = this.health / this.maxHealth;
        let healthColor;
        if (healthPercent > 0.5) {
            healthColor = '#51cf66';
        } else if (healthPercent > 0.25) {
            healthColor = '#fcc419';
        } else {
            healthColor = '#ff6b6b';
        }

        ctx.fillStyle = healthColor;
        ctx.fillRect(-width / 2, y, width * healthPercent, height);

        // Border
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.strokeRect(-width / 2, y, width, height);
    }
}

// Basic Enemy - Peasant soldier
export class BasicEnemy extends Enemy {
    constructor(config = {}) {
        super({
            ...config,
            health: config.health || 100,
            speed: config.speed || 80,
            reward: config.reward || 10,
            radius: 14,
            color: '#8b4513', // Brown tunic
            secondaryColor: '#5c3317'
        });
    }

    renderBody(ctx) {
        const bounce = Math.sin(this.walkCycle) * 2;

        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(0, this.radius - 2, this.radius * 0.7, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Legs (walking animation)
        ctx.fillStyle = '#4a3520';
        const legOffset = Math.sin(this.walkCycle) * 4;
        ctx.fillRect(-5, 5, 4, 8);
        ctx.fillRect(1, 5, 4, 8);

        // Body (peasant tunic)
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(-8, -3 + bounce);
        ctx.lineTo(-9, 8);
        ctx.lineTo(9, 8);
        ctx.lineTo(8, -3 + bounce);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = this.secondaryColor;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Belt
        ctx.fillStyle = '#3d2817';
        ctx.fillRect(-8, 2 + bounce, 16, 3);

        // Head
        ctx.fillStyle = '#deb887';
        ctx.beginPath();
        ctx.arc(0, -8 + bounce, 6, 0, Math.PI * 2);
        ctx.fill();

        // Hair
        ctx.fillStyle = '#4a3520';
        ctx.beginPath();
        ctx.arc(0, -10 + bounce, 5, Math.PI, 0);
        ctx.fill();

        // Face
        ctx.fillStyle = '#000';
        ctx.fillRect(-3, -9 + bounce, 2, 2);
        ctx.fillRect(1, -9 + bounce, 2, 2);

        // Simple weapon (stick/club)
        ctx.fillStyle = '#5c4033';
        ctx.save();
        ctx.translate(8, 0 + bounce);
        ctx.rotate(0.3);
        ctx.fillRect(-2, -12, 3, 14);
        ctx.restore();
    }
}

// Fast Enemy - Scout/thief
export class FastEnemy extends Enemy {
    constructor(config = {}) {
        super({
            ...config,
            health: config.health || 50,
            speed: config.speed || 150,
            reward: config.reward || 15,
            radius: 11,
            color: '#2d4a3a', // Dark green (scout colors)
            secondaryColor: '#1a2d24'
        });
    }

    renderBody(ctx) {
        const bounce = Math.sin(this.walkCycle * 1.5) * 1.5;

        // Shadow (smaller, faster)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(0, this.radius - 2, this.radius * 0.6, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Crouched running pose
        ctx.fillStyle = this.color;

        // Body (leaning forward)
        ctx.save();
        ctx.rotate(0.2);
        ctx.beginPath();
        ctx.moveTo(-5, -2 + bounce);
        ctx.lineTo(-6, 6);
        ctx.lineTo(6, 6);
        ctx.lineTo(5, -2 + bounce);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Hood/cloak
        ctx.fillStyle = this.secondaryColor;
        ctx.beginPath();
        ctx.moveTo(-6, -5 + bounce);
        ctx.lineTo(-8, 4);
        ctx.lineTo(0, 2);
        ctx.closePath();
        ctx.fill();

        // Head with hood
        ctx.fillStyle = '#deb887';
        ctx.beginPath();
        ctx.arc(0, -6 + bounce, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, -8 + bounce, 5, Math.PI * 0.8, Math.PI * 0.2);
        ctx.fill();

        // Eyes (alert)
        ctx.fillStyle = '#000';
        ctx.fillRect(-2, -7 + bounce, 1.5, 1.5);
        ctx.fillRect(0.5, -7 + bounce, 1.5, 1.5);

        // Dagger
        ctx.fillStyle = '#888';
        ctx.save();
        ctx.translate(5, 2 + bounce);
        ctx.rotate(-0.5);
        ctx.beginPath();
        ctx.moveTo(0, -8);
        ctx.lineTo(-2, 0);
        ctx.lineTo(2, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}

// Tank Enemy - Armored knight
export class TankEnemy extends Enemy {
    constructor(config = {}) {
        super({
            ...config,
            health: config.health || 400,
            speed: config.speed || 40,
            reward: config.reward || 30,
            damage: config.damage || 2,
            radius: 20,
            color: '#555', // Steel armor
            secondaryColor: '#333'
        });
    }

    renderBody(ctx) {
        const bounce = Math.sin(this.walkCycle * 0.7) * 1;

        // Shadow (larger)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.ellipse(0, this.radius - 2, this.radius * 0.8, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Armored body
        const armorGradient = ctx.createLinearGradient(-12, 0, 12, 0);
        armorGradient.addColorStop(0, '#444');
        armorGradient.addColorStop(0.3, '#666');
        armorGradient.addColorStop(0.7, '#777');
        armorGradient.addColorStop(1, '#555');
        ctx.fillStyle = armorGradient;

        // Main body armor
        ctx.beginPath();
        ctx.moveTo(-12, -5 + bounce);
        ctx.lineTo(-14, 12);
        ctx.lineTo(14, 12);
        ctx.lineTo(12, -5 + bounce);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Armor plate lines
        ctx.strokeStyle = '#444';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-10, 0 + bounce);
        ctx.lineTo(10, 0 + bounce);
        ctx.moveTo(-9, 5 + bounce);
        ctx.lineTo(9, 5 + bounce);
        ctx.stroke();

        // Shield
        ctx.fillStyle = '#8b0000';
        ctx.beginPath();
        ctx.moveTo(-16, -5 + bounce);
        ctx.lineTo(-18, 8);
        ctx.lineTo(-12, 12);
        ctx.lineTo(-10, -2 + bounce);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Shield emblem
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(-14, 3 + bounce, 3, 0, Math.PI * 2);
        ctx.fill();

        // Helmet
        ctx.fillStyle = '#555';
        ctx.beginPath();
        ctx.arc(0, -10 + bounce, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.stroke();

        // Visor
        ctx.fillStyle = '#222';
        ctx.fillRect(-6, -12 + bounce, 12, 4);

        // Visor slits (eyes)
        ctx.fillStyle = '#600';
        ctx.fillRect(-4, -11 + bounce, 3, 2);
        ctx.fillRect(1, -11 + bounce, 3, 2);

        // Helmet crest
        ctx.fillStyle = '#8b0000';
        ctx.beginPath();
        ctx.moveTo(0, -19 + bounce);
        ctx.lineTo(-3, -10 + bounce);
        ctx.lineTo(3, -10 + bounce);
        ctx.closePath();
        ctx.fill();

        // Sword
        ctx.fillStyle = '#888';
        ctx.save();
        ctx.translate(14, 0 + bounce);
        ctx.rotate(0.3);
        ctx.fillRect(-2, -18, 4, 20);
        // Crossguard
        ctx.fillStyle = '#666';
        ctx.fillRect(-5, -2, 10, 3);
        // Handle
        ctx.fillStyle = '#4a3520';
        ctx.fillRect(-1, 2, 2, 6);
        ctx.restore();
    }
}

// Boss Enemy - Dark lord/general
export class BossEnemy extends Enemy {
    constructor(config = {}) {
        super({
            ...config,
            health: config.health || 2000,
            speed: config.speed || 30,
            reward: config.reward || 200,
            damage: config.damage || 5,
            radius: 32,
            color: '#2a0a2a', // Dark purple
            secondaryColor: '#1a051a'
        });

        this.phase = 1;
        this.pulseTime = 0;
        this.capeWave = 0;
    }

    update(dt) {
        super.update(dt);

        // Phase transitions
        const healthPercent = this.health / this.maxHealth;
        if (healthPercent < 0.5 && this.phase === 1) {
            this.phase = 2;
            this.speed = this.baseSpeed * 1.5;
        } else if (healthPercent < 0.25 && this.phase === 2) {
            this.phase = 3;
            this.speed = this.baseSpeed * 2;
        }

        this.pulseTime += dt * 3;
        this.capeWave += dt * 4;
    }

    renderBody(ctx) {
        const bounce = Math.sin(this.walkCycle * 0.5) * 2;

        // Dark aura
        const auraSize = 40 + Math.sin(this.pulseTime) * 5;
        const gradient = ctx.createRadialGradient(0, 0, 10, 0, 0, auraSize);
        gradient.addColorStop(0, 'rgba(100, 0, 100, 0.3)');
        gradient.addColorStop(1, 'rgba(50, 0, 50, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, auraSize, 0, Math.PI * 2);
        ctx.fill();

        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.beginPath();
        ctx.ellipse(0, this.radius - 3, this.radius, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Cape (flowing)
        ctx.fillStyle = '#1a051a';
        ctx.beginPath();
        ctx.moveTo(-15, -10 + bounce);
        for (let i = 0; i <= 6; i++) {
            const x = -15 + i * 5;
            const y = 15 + Math.sin(this.capeWave + i * 0.5) * 3;
            ctx.lineTo(x, y);
        }
        ctx.lineTo(15, -10 + bounce);
        ctx.closePath();
        ctx.fill();

        // Body (dark armor)
        const armorGradient = ctx.createLinearGradient(-15, 0, 15, 0);
        armorGradient.addColorStop(0, '#1a0a1a');
        armorGradient.addColorStop(0.5, '#3a1a3a');
        armorGradient.addColorStop(1, '#1a0a1a');
        ctx.fillStyle = armorGradient;

        ctx.beginPath();
        ctx.moveTo(-14, -8 + bounce);
        ctx.lineTo(-16, 14);
        ctx.lineTo(16, 14);
        ctx.lineTo(14, -8 + bounce);
        ctx.closePath();
        ctx.fill();

        // Armor details
        ctx.strokeStyle = '#4a2a4a';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Skull emblem
        ctx.fillStyle = '#aaa';
        ctx.beginPath();
        ctx.arc(0, 3 + bounce, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#333';
        ctx.fillRect(-3, 1 + bounce, 2, 2);
        ctx.fillRect(1, 1 + bounce, 2, 2);
        ctx.fillRect(-1, 5 + bounce, 2, 2);

        // Spiked pauldrons
        ctx.fillStyle = '#2a1a2a';
        // Left
        ctx.beginPath();
        ctx.moveTo(-14, -6 + bounce);
        ctx.lineTo(-22, -3 + bounce);
        ctx.lineTo(-18, -12 + bounce);
        ctx.lineTo(-12, -10 + bounce);
        ctx.closePath();
        ctx.fill();
        // Right
        ctx.beginPath();
        ctx.moveTo(14, -6 + bounce);
        ctx.lineTo(22, -3 + bounce);
        ctx.lineTo(18, -12 + bounce);
        ctx.lineTo(12, -10 + bounce);
        ctx.closePath();
        ctx.fill();

        // Horned helmet
        ctx.fillStyle = '#2a1a2a';
        ctx.beginPath();
        ctx.arc(0, -14 + bounce, 10, 0, Math.PI * 2);
        ctx.fill();

        // Horns
        ctx.fillStyle = '#1a0a1a';
        ctx.beginPath();
        ctx.moveTo(-8, -18 + bounce);
        ctx.lineTo(-15, -30 + bounce);
        ctx.lineTo(-6, -22 + bounce);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(8, -18 + bounce);
        ctx.lineTo(15, -30 + bounce);
        ctx.lineTo(6, -22 + bounce);
        ctx.closePath();
        ctx.fill();

        // Glowing eyes
        const eyeGlow = this.phase >= 2 ? 25 : 15;
        ctx.shadowColor = this.phase >= 3 ? '#ff0000' : '#aa00aa';
        ctx.shadowBlur = eyeGlow;
        ctx.fillStyle = this.phase >= 3 ? '#ff0000' : '#ff00ff';
        ctx.beginPath();
        ctx.arc(-4, -15 + bounce, 3, 0, Math.PI * 2);
        ctx.arc(4, -15 + bounce, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Dark staff
        ctx.fillStyle = '#1a0a1a';
        ctx.save();
        ctx.translate(20, 5 + bounce);
        ctx.rotate(0.2);
        ctx.fillRect(-2, -35, 4, 40);

        // Staff orb
        ctx.shadowColor = '#aa00aa';
        ctx.shadowBlur = 15;
        ctx.fillStyle = '#8800aa';
        ctx.beginPath();
        ctx.arc(0, -38, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();

        // Phase indicator particles
        if (this.phase >= 2) {
            ctx.fillStyle = this.phase >= 3 ? 'rgba(255, 0, 0, 0.6)' : 'rgba(170, 0, 170, 0.6)';
            for (let i = 0; i < 5; i++) {
                const angle = this.pulseTime * 0.5 + i * (Math.PI * 2 / 5);
                const radius = 25 + this.phase * 5;
                const px = Math.cos(angle) * radius;
                const py = Math.sin(angle) * radius * 0.5;
                ctx.beginPath();
                ctx.arc(px, py, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    renderHealthBar(ctx) {
        // Larger boss health bar
        const width = 50;
        const height = 6;
        const y = -this.radius - 18;

        // Background
        ctx.fillStyle = '#222';
        ctx.fillRect(-width / 2 - 1, y - 1, width + 2, height + 2);
        ctx.fillStyle = '#333';
        ctx.fillRect(-width / 2, y, width, height);

        // Health with phase colors
        const healthPercent = this.health / this.maxHealth;
        let healthColor;
        if (this.phase === 3) {
            healthColor = '#ff3333';
        } else if (this.phase === 2) {
            healthColor = '#ff9933';
        } else {
            healthColor = '#aa33aa';
        }

        ctx.fillStyle = healthColor;
        ctx.fillRect(-width / 2, y, width * healthPercent, height);

        // Border
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.strokeRect(-width / 2, y, width, height);

        // Boss label
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('DARK LORD', 0, y - 4);
    }
}

// Export enemy classes map
export const EnemyClasses = {
    basic: BasicEnemy,
    fast: FastEnemy,
    tank: TankEnemy,
    boss: BossEnemy
};
