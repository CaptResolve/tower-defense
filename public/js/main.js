// main.js - Game entry point and initialization

import { Game, GameState } from './engine/Game.js';
import { Input } from './engine/Input.js';
import { Renderer } from './engine/Renderer.js';
import { Player } from './entities/Player.js';
import { BasicTower, SniperTower, SplashTower, SlowTower, TowerClasses } from './entities/Tower.js';
import { WaveManager } from './systems/WaveManager.js';
import { Economy } from './systems/Economy.js';
import { LevelManager } from './systems/LevelManager.js';
import { UI } from './systems/UI.js';

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initGame();
});

function initGame() {
    // Get canvas element
    const canvas = document.getElementById('game-canvas');
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }

    // Create game instance
    const game = new Game(canvas);

    // Create systems
    const renderer = new Renderer();
    const input = new Input(canvas, game);
    const economy = new Economy(game);
    const waveManager = new WaveManager(game);
    const levelManager = new LevelManager(game);
    const ui = new UI(game);
    const player = new Player(game);

    // Set tower classes for dynamic creation
    game.towerClasses = TowerClasses;

    // Initialize game with systems
    game.init({
        renderer,
        input,
        economy,
        waveManager,
        levelManager,
        ui,
        player
    });

    // Setup menu event listeners
    setupMenus(game);

    // Start game loop
    game.start();

    // Make game globally accessible for debugging
    window.game = game;
}

function setupMenus(game) {
    // Main menu buttons
    document.getElementById('btn-play')?.addEventListener('click', () => {
        game.startLevel(1);
    });

    document.getElementById('btn-level-select')?.addEventListener('click', () => {
        showLevelSelect(game);
    });

    document.getElementById('btn-how-to-play')?.addEventListener('click', () => {
        document.getElementById('main-menu').classList.add('hidden');
        document.getElementById('how-to-play').classList.remove('hidden');
    });

    // Back buttons
    document.getElementById('btn-back-menu')?.addEventListener('click', () => {
        document.getElementById('level-select').classList.add('hidden');
        document.getElementById('main-menu').classList.remove('hidden');
    });

    document.getElementById('btn-back-menu2')?.addEventListener('click', () => {
        document.getElementById('how-to-play').classList.add('hidden');
        document.getElementById('main-menu').classList.remove('hidden');
    });

    // Pause menu buttons
    document.getElementById('btn-resume')?.addEventListener('click', () => {
        game.togglePause();
    });

    document.getElementById('btn-restart')?.addEventListener('click', () => {
        document.getElementById('pause-menu').classList.add('hidden');
        game.startLevel(game.levelId);
    });

    document.getElementById('btn-quit')?.addEventListener('click', () => {
        document.getElementById('pause-menu').classList.add('hidden');
        document.getElementById('main-menu').classList.remove('hidden');
        game.state = GameState.MENU;
    });

    // Game over buttons
    document.getElementById('btn-retry')?.addEventListener('click', () => {
        document.getElementById('game-over').classList.add('hidden');
        game.startLevel(game.levelId);
    });

    document.getElementById('btn-next-level')?.addEventListener('click', () => {
        document.getElementById('game-over').classList.add('hidden');
        game.startLevel(game.levelId + 1);
    });

    document.getElementById('btn-menu')?.addEventListener('click', () => {
        document.getElementById('game-over').classList.add('hidden');
        document.getElementById('main-menu').classList.remove('hidden');
        game.state = GameState.MENU;
    });
}

function showLevelSelect(game) {
    const grid = document.getElementById('level-grid');
    grid.innerHTML = '';

    const levels = game.levelManager.getLevelSelectData();

    for (const level of levels) {
        const btn = document.createElement('button');
        btn.className = 'level-btn';
        btn.disabled = !level.unlocked;
        btn.innerHTML = `${level.id}<div class="stars">${getStarsDisplay(level.stars)}</div>`;

        if (level.unlocked) {
            btn.addEventListener('click', () => {
                document.getElementById('level-select').classList.add('hidden');
                game.startLevel(level.id);
            });
        }

        grid.appendChild(btn);
    }

    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('level-select').classList.remove('hidden');
}

function getStarsDisplay(stars) {
    let display = '';
    for (let i = 0; i < 3; i++) {
        display += i < stars ? '\u2605' : '\u2606';
    }
    return display;
}
