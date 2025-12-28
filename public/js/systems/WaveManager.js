// WaveManager.js - Manages enemy wave spawning

import { EnemyClasses } from '../entities/Enemy.js';

export class WaveManager {
    constructor(game) {
        this.game = game;

        // Wave data
        this.waves = [];
        this.currentWave = 0;
        this.totalWaves = 0;

        // Spawn queue
        this.spawnQueue = [];
        this.spawnTimer = 0;

        // State
        this.state = 'waiting'; // waiting, spawning, active, complete
        this.waveDelay = 5; // Seconds between waves
        this.waveTimer = 0;
        this.autoStart = true;

        // Scaling for level difficulty
        this.healthMultiplier = 1;
        this.speedMultiplier = 1;
        this.rewardMultiplier = 1;
    }

    loadLevel(level) {
        this.waves = level.waves || [];
        this.totalWaves = this.waves.length;
        this.currentWave = 0;
        this.spawnQueue = [];
        this.spawnTimer = 0;
        this.waveTimer = 0;
        this.state = 'waiting';

        // Apply level scaling
        const scaling = level.scaling || {};
        this.healthMultiplier = scaling.health || 1;
        this.speedMultiplier = scaling.speed || 1;
        this.rewardMultiplier = scaling.reward || 1;
    }

    update(dt) {
        if (this.state === 'waiting') {
            this.waveTimer += dt;
            if (this.waveTimer >= this.waveDelay) {
                this.waveTimer = 0;
                if (this.autoStart) {
                    this.startNextWave();
                }
            }
        } else if (this.state === 'spawning') {
            this.spawnTimer += dt;

            if (this.spawnQueue.length > 0) {
                const next = this.spawnQueue[0];
                if (this.spawnTimer >= next.delay) {
                    this.spawnEnemy(next);
                    this.spawnQueue.shift();
                    this.spawnTimer = 0;
                }
            } else {
                // All enemies spawned for this wave
                this.state = 'active';
            }
        } else if (this.state === 'active') {
            // Check if all enemies defeated
            if (this.game.enemies.length === 0) {
                if (this.currentWave >= this.totalWaves) {
                    this.state = 'complete';
                } else {
                    this.state = 'waiting';
                    this.waveTimer = 0;
                }
            }
        }
    }

    startNextWave() {
        if (this.currentWave >= this.totalWaves) {
            this.state = 'complete';
            return false;
        }

        const wave = this.waves[this.currentWave];
        this.spawnQueue = this.buildSpawnQueue(wave);
        this.state = 'spawning';
        this.spawnTimer = 0;
        this.currentWave++;

        return true;
    }

    buildSpawnQueue(wave) {
        const queue = [];

        for (const group of wave.groups) {
            const count = group.count || 1;
            const delay = group.delay || 0.5;
            const type = group.type || 'basic';

            for (let i = 0; i < count; i++) {
                queue.push({
                    type,
                    delay,
                    pathIndex: group.pathIndex || 0
                });
            }
        }

        return queue;
    }

    spawnEnemy(spawnData) {
        const EnemyClass = EnemyClasses[spawnData.type];
        if (!EnemyClass) {
            console.error('Unknown enemy type:', spawnData.type);
            return;
        }

        // Determine which path to use
        let path = this.game.path;
        if (Array.isArray(this.game.currentLevel?.paths)) {
            const pathIndex = spawnData.pathIndex || 0;
            path = this.game.currentLevel.paths[pathIndex] || this.game.path;
        }

        // Create enemy with scaling applied
        const enemy = new EnemyClass({
            path: path,
            health: undefined, // Use default, will be scaled
            speed: undefined
        });

        // Apply scaling
        enemy.health = Math.floor(enemy.health * this.healthMultiplier);
        enemy.maxHealth = enemy.health;
        enemy.speed = enemy.speed * this.speedMultiplier;
        enemy.baseSpeed = enemy.speed;
        enemy.reward = Math.floor(enemy.reward * this.rewardMultiplier);

        this.game.enemies.push(enemy);
    }

    skipWaveDelay() {
        if (this.state === 'waiting') {
            this.waveTimer = this.waveDelay;
        }
    }

    isComplete() {
        return this.state === 'complete';
    }

    getProgress() {
        return {
            current: this.currentWave,
            total: this.totalWaves,
            state: this.state,
            countdown: Math.max(0, this.waveDelay - this.waveTimer)
        };
    }
}
