// Game.js - Core game loop and state management

import { Terrain } from './Terrain.js';
import { Environment } from './Environment.js';

export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;
export const TILE_SIZE = 40;

export const GameState = {
    MENU: 'menu',
    PLAYING: 'playing',
    PAUSED: 'paused',
    WAVE_COMPLETE: 'wave_complete',
    LEVEL_COMPLETE: 'level_complete',
    GAME_OVER: 'game_over'
};

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        // Set internal resolution
        this.canvas.width = GAME_WIDTH;
        this.canvas.height = GAME_HEIGHT;

        // Game state
        this.state = GameState.MENU;
        this.lastTime = 0;
        this.running = false;
        this.currentLevel = null;
        this.levelId = 1;

        // Game objects
        this.player = null;
        this.towers = [];
        this.enemies = [];
        this.projectiles = [];
        this.particles = [];

        // Systems (will be set by main.js)
        this.input = null;
        this.economy = null;
        this.waveManager = null;
        this.levelManager = null;
        this.ui = null;
        this.renderer = null;

        // Terrain and environment systems
        this.terrain = new Terrain(this);
        this.environment = new Environment(this);

        // Game stats
        this.lives = 20;
        this.maxLives = 20;
        this.score = 0;
        this.waveNumber = 0;

        // Path for current level
        this.path = [];

        // Selected tower for upgrades/selling
        this.selectedTower = null;

        // Bind methods
        this.loop = this.loop.bind(this);
    }

    init(systems) {
        this.input = systems.input;
        this.economy = systems.economy;
        this.waveManager = systems.waveManager;
        this.levelManager = systems.levelManager;
        this.ui = systems.ui;
        this.renderer = systems.renderer;
        this.player = systems.player;

        // Load save data
        this.loadProgress();

        // Setup resize handler
        window.addEventListener('resize', () => this.resize());
        this.resize();
    }

    resize() {
        const container = this.canvas.parentElement;
        const aspectRatio = GAME_WIDTH / GAME_HEIGHT;

        let width = container.clientWidth;
        let height = width / aspectRatio;

        if (height > container.clientHeight) {
            height = container.clientHeight;
            width = height * aspectRatio;
        }

        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
    }

    start() {
        this.running = true;
        this.lastTime = performance.now();
        requestAnimationFrame(this.loop);
    }

    stop() {
        this.running = false;
    }

    loop(timestamp) {
        if (!this.running) return;

        const deltaTime = Math.min((timestamp - this.lastTime) / 1000, 0.1);
        this.lastTime = timestamp;

        this.update(deltaTime);
        this.render();

        requestAnimationFrame(this.loop);
    }

    update(dt) {
        if (this.state !== GameState.PLAYING) return;

        // Update player
        this.player.update(dt, this.input);

        // Update wave manager
        this.waveManager.update(dt);

        // Update enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.update(dt);

            if (enemy.isDead) {
                this.enemies.splice(i, 1);
            } else if (enemy.reachedEnd) {
                this.damageBase(enemy.damage);
                this.enemies.splice(i, 1);
            }
        }

        // Update towers
        for (const tower of this.towers) {
            tower.update(dt, this.enemies, this);
        }

        // Update projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const proj = this.projectiles[i];
            proj.update(dt);

            if (proj.isDead || proj.isOffScreen(GAME_WIDTH, GAME_HEIGHT)) {
                this.projectiles.splice(i, 1);
            }
        }

        // Update particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.update(dt);

            if (particle.isDead) {
                this.particles.splice(i, 1);
            }
        }

        // Check collisions
        this.checkCollisions();

        // Check win/lose conditions
        this.checkGameState();
    }

    render() {
        // Clear canvas
        this.ctx.fillStyle = '#2d5016';
        this.ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        if (this.state === GameState.MENU) return;

        // Render environment background (grass, hills, ponds)
        this.environment.renderBackground(this.ctx);

        // Render path
        this.renderer.renderPath(this.ctx, this.path);

        // Render trees (behind towers)
        this.environment.renderTrees(this.ctx, this.terrain.trees);

        // Render towers
        for (const tower of this.towers) {
            tower.render(this.ctx, tower === this.selectedTower);
            // Show hill indicator if tower is on a hill
            if (tower.onHill) {
                this.renderer.renderHillIndicator(this.ctx, tower.x, tower.y);
            }
        }

        // Render enemies
        for (const enemy of this.enemies) {
            enemy.render(this.ctx);
        }

        // Render projectiles
        for (const proj of this.projectiles) {
            proj.render(this.ctx);
        }

        // Render particles
        for (const particle of this.particles) {
            particle.render(this.ctx);
        }

        // Render player
        this.player.render(this.ctx, this.input);

        // Render placement ghost with terrain info
        if (this.input.selectedTowerType && this.input.placementGhost) {
            const ghost = this.input.placementGhost;
            const onHill = this.terrain.isOnHill(ghost.x, ghost.y);
            const terrainType = this.terrain.getTerrainType(ghost.x, ghost.y);

            this.renderer.renderPlacementGhost(
                this.ctx,
                ghost,
                this.input.selectedTowerType,
                onHill
            );

            // Show terrain type indicator
            this.renderer.renderTerrainIndicator(
                this.ctx,
                ghost.x, ghost.y,
                terrainType,
                ghost.valid
            );
        }

        // Render UI
        this.ui.render(this.ctx, this);
    }

    checkCollisions() {
        // Check projectile-enemy collisions
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const proj = this.projectiles[i];
            if (proj.isDead) continue;

            for (const enemy of this.enemies) {
                if (enemy.isDead) continue;

                const dx = proj.x - enemy.x;
                const dy = proj.y - enemy.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < proj.radius + enemy.radius) {
                    // Hit!
                    enemy.takeDamage(proj.damage);

                    // Spawn hit particles
                    this.spawnParticles('hit', proj.x, proj.y, proj.color);

                    // Apply special effects
                    if (proj.slowFactor) {
                        enemy.applySlow(proj.slowFactor, 2);
                    }

                    // Splash damage
                    if (proj.splashRadius) {
                        this.applySplashDamage(proj);
                    }

                    // Check if enemy died
                    if (enemy.isDead) {
                        this.onEnemyKilled(enemy);
                    }

                    // Remove projectile unless piercing
                    if (!proj.piercing) {
                        proj.isDead = true;
                    }

                    break;
                }
            }
        }
    }

    applySplashDamage(proj) {
        for (const enemy of this.enemies) {
            if (enemy.isDead) continue;

            const dx = proj.x - enemy.x;
            const dy = proj.y - enemy.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < proj.splashRadius && dist > proj.radius) {
                const falloff = 1 - (dist / proj.splashRadius);
                enemy.takeDamage(proj.damage * falloff * 0.5);

                if (enemy.isDead) {
                    this.onEnemyKilled(enemy);
                }
            }
        }
    }

    onEnemyKilled(enemy) {
        this.economy.addGold(enemy.reward);
        this.score += enemy.reward * 10;
        this.spawnParticles('explosion', enemy.x, enemy.y, enemy.color);
    }

    spawnParticles(type, x, y, color) {
        const count = type === 'explosion' ? 12 : 5;
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x, y,
                vx: (Math.random() - 0.5) * 200,
                vy: (Math.random() - 0.5) * 200,
                radius: Math.random() * 4 + 2,
                color: color || '#ff6b6b',
                life: 0.5,
                maxLife: 0.5,
                isDead: false,
                update(dt) {
                    this.x += this.vx * dt;
                    this.y += this.vy * dt;
                    this.life -= dt;
                    if (this.life <= 0) this.isDead = true;
                },
                render(ctx) {
                    const alpha = this.life / this.maxLife;
                    ctx.globalAlpha = alpha;
                    ctx.fillStyle = this.color;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius * alpha, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.globalAlpha = 1;
                }
            });
        }
    }

    damageBase(amount) {
        this.lives -= amount;
        if (this.lives <= 0) {
            this.lives = 0;
            this.gameOver(false);
        }
    }

    checkGameState() {
        // Check if level complete
        if (this.waveManager.isComplete() && this.enemies.length === 0) {
            this.levelComplete();
        }
    }

    startLevel(levelId) {
        this.levelId = levelId;
        const level = this.levelManager.getLevel(levelId);

        if (!level) {
            console.error('Level not found:', levelId);
            return;
        }

        this.currentLevel = level;

        // Reset game state
        this.towers = [];
        this.enemies = [];
        this.projectiles = [];
        this.particles = [];
        this.selectedTower = null;

        // Set level properties
        this.lives = level.lives;
        this.maxLives = level.lives;
        this.score = 0;
        this.path = level.path;

        // Load terrain data from level
        this.terrain.loadFromLevel(level);

        // Generate environment background
        this.environment.generateBackground(this.terrain);

        // Initialize economy
        this.economy.init(level.startingGold);

        // Initialize wave manager
        this.waveManager.loadLevel(level);

        // Hide menus, start game
        this.hideAllOverlays();
        this.state = GameState.PLAYING;
    }

    levelComplete() {
        this.state = GameState.LEVEL_COMPLETE;

        // Calculate stars
        const starsEarned = this.calculateStars();

        // Save progress
        this.saveProgress(this.levelId, starsEarned);

        // Show victory screen
        this.showGameOver(true, starsEarned);
    }

    gameOver(won) {
        this.state = GameState.GAME_OVER;
        this.showGameOver(won, 0);
    }

    calculateStars() {
        const livesPercent = this.lives / this.maxLives;
        if (livesPercent >= 0.9) return 3;
        if (livesPercent >= 0.5) return 2;
        return 1;
    }

    showGameOver(won, stars) {
        const overlay = document.getElementById('game-over');
        const title = document.getElementById('game-over-title');
        const message = document.getElementById('game-over-message');
        const starsDisplay = document.getElementById('stars-display');
        const nextBtn = document.getElementById('btn-next-level');

        title.textContent = won ? 'Victory!' : 'Defeat';
        message.textContent = won
            ? `Level ${this.levelId} Complete! Score: ${this.score}`
            : `You survived ${this.waveManager.currentWave} waves. Score: ${this.score}`;

        // Show stars
        starsDisplay.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            const star = document.createElement('span');
            star.className = 'star' + (i < stars ? '' : ' empty');
            star.textContent = '\u2605';
            starsDisplay.appendChild(star);
        }

        // Show/hide next level button
        if (won && this.levelId < 25) {
            nextBtn.classList.remove('hidden');
        } else {
            nextBtn.classList.add('hidden');
        }

        overlay.classList.remove('hidden');
    }

    hideAllOverlays() {
        document.querySelectorAll('.overlay').forEach(el => {
            el.classList.add('hidden');
        });
    }

    togglePause() {
        if (this.state === GameState.PLAYING) {
            this.state = GameState.PAUSED;
            document.getElementById('pause-menu').classList.remove('hidden');
        } else if (this.state === GameState.PAUSED) {
            this.state = GameState.PLAYING;
            document.getElementById('pause-menu').classList.add('hidden');
        }
    }

    // Tower placement - terrain-based validation
    canPlaceTower(x, y) {
        // Check if terrain allows placement (not on path, water, or trees)
        if (!this.terrain.canPlaceAt(x, y)) return false;

        // Check if not too close to screen edges
        if (x < 40 || x > GAME_WIDTH - 40 || y < 100 || y > GAME_HEIGHT - 100) {
            return false;
        }

        // Check if not overlapping another tower
        const overlapping = this.towers.some(tower => {
            const dx = tower.x - x;
            const dy = tower.y - y;
            return Math.sqrt(dx * dx + dy * dy) < 50;
        });

        return !overlapping;
    }

    tryPlaceTower(type, x, y) {
        // Snap to grid center
        const gridX = Math.floor(x / TILE_SIZE) * TILE_SIZE + TILE_SIZE / 2;
        const gridY = Math.floor(y / TILE_SIZE) * TILE_SIZE + TILE_SIZE / 2;

        if (!this.canPlaceTower(gridX, gridY)) return false;

        const cost = this.economy.getTowerCost(type);
        if (!this.economy.spendGold(cost)) return false;

        // Check if tower is on a hill for range bonus
        const onHill = this.terrain.isOnHill(gridX, gridY);

        // Import tower class dynamically
        const TowerClass = this.getTowerClass(type);
        const tower = new TowerClass(gridX, gridY, { onHill });
        this.towers.push(tower);

        // Clear selection
        this.input.cancelPlacement();

        return true;
    }

    getTowerClass(type) {
        // This will be set by main.js
        return this.towerClasses[type];
    }

    selectTower(tower) {
        this.selectedTower = tower;
    }

    deselectTower() {
        this.selectedTower = null;
    }

    upgradeSelectedTower() {
        if (!this.selectedTower) return false;
        if (this.selectedTower.level >= 3) return false;

        const cost = this.economy.getUpgradeCost(this.selectedTower);
        if (!this.economy.spendGold(cost)) return false;

        this.selectedTower.upgrade();
        return true;
    }

    sellSelectedTower() {
        if (!this.selectedTower) return;

        const value = this.economy.getSellValue(this.selectedTower);
        this.economy.addGold(value);

        const index = this.towers.indexOf(this.selectedTower);
        if (index > -1) {
            this.towers.splice(index, 1);
        }

        this.selectedTower = null;
    }

    getTowerAt(x, y) {
        for (const tower of this.towers) {
            const dx = tower.x - x;
            const dy = tower.y - y;
            if (Math.sqrt(dx * dx + dy * dy) < 25) {
                return tower;
            }
        }
        return null;
    }

    // Save/Load
    saveProgress(levelId, stars) {
        const progress = JSON.parse(localStorage.getItem('towerDefenseProgress') || '{}');
        progress.maxLevel = Math.max(progress.maxLevel || 1, levelId + 1);
        progress.stars = progress.stars || {};
        progress.stars[levelId] = Math.max(progress.stars[levelId] || 0, stars);
        localStorage.setItem('towerDefenseProgress', JSON.stringify(progress));
    }

    loadProgress() {
        const progress = JSON.parse(localStorage.getItem('towerDefenseProgress') || '{}');
        return {
            maxLevel: progress.maxLevel || 1,
            stars: progress.stars || {}
        };
    }

    getStarsForLevel(levelId) {
        const progress = this.loadProgress();
        return progress.stars[levelId] || 0;
    }

    isLevelUnlocked(levelId) {
        const progress = this.loadProgress();
        return levelId <= (progress.maxLevel || 1);
    }
}
