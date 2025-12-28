// Input.js - Unified mouse and touch input handling

import { GAME_WIDTH, GAME_HEIGHT, TILE_SIZE } from './Game.js';

export class Input {
    constructor(canvas, game) {
        this.canvas = canvas;
        this.game = game;

        // Mouse/touch position (in game coordinates)
        this.mouseX = 0;
        this.mouseY = 0;

        // Pointer state
        this.isPointerDown = false;
        this.pointerStartX = 0;
        this.pointerStartY = 0;

        // Tower placement
        this.selectedTowerType = null;
        this.placementGhost = null;

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Unified pointer events (works for both mouse and touch)
        this.canvas.addEventListener('pointerdown', this.onPointerDown.bind(this));
        this.canvas.addEventListener('pointermove', this.onPointerMove.bind(this));
        this.canvas.addEventListener('pointerup', this.onPointerUp.bind(this));
        this.canvas.addEventListener('pointerleave', this.onPointerUp.bind(this));
        this.canvas.addEventListener('pointercancel', this.onPointerUp.bind(this));

        // Prevent default touch behaviors (scrolling, zooming, etc.)
        this.canvas.addEventListener('touchstart', e => e.preventDefault(), { passive: false });
        this.canvas.addEventListener('touchmove', e => e.preventDefault(), { passive: false });

        // Context menu (right-click) - cancel tower placement
        this.canvas.addEventListener('contextmenu', e => {
            e.preventDefault();
            this.cancelPlacement();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', this.onKeyDown.bind(this));
    }

    // Convert screen coordinates to game canvas coordinates
    getCanvasCoords(clientX, clientY) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    }

    onPointerDown(e) {
        const coords = this.getCanvasCoords(e.clientX, e.clientY);
        this.mouseX = coords.x;
        this.mouseY = coords.y;
        this.isPointerDown = true;
        this.pointerStartX = coords.x;
        this.pointerStartY = coords.y;

        // Check if clicking on UI first
        if (this.game.ui && this.game.ui.handleClick(coords.x, coords.y, this.game)) {
            return;
        }

        // Check if clicking on an existing tower (for selection)
        const clickedTower = this.game.getTowerAt(coords.x, coords.y);
        if (clickedTower) {
            this.game.selectTower(clickedTower);
            this.cancelPlacement();
            return;
        }

        // If we're placing a tower, try to place it
        if (this.selectedTowerType) {
            if (this.game.tryPlaceTower(this.selectedTowerType, coords.x, coords.y)) {
                // Tower placed successfully
                return;
            }
        }

        // Otherwise, deselect tower and start player firing
        this.game.deselectTower();
        if (this.game.player) {
            this.game.player.isFiring = true;
        }
    }

    onPointerMove(e) {
        const coords = this.getCanvasCoords(e.clientX, e.clientY);
        this.mouseX = coords.x;
        this.mouseY = coords.y;

        // Update placement ghost position if we're placing a tower
        if (this.selectedTowerType) {
            this.updatePlacementGhost(coords.x, coords.y);
        }
    }

    onPointerUp(e) {
        this.isPointerDown = false;
        if (this.game.player) {
            this.game.player.isFiring = false;
        }
    }

    onKeyDown(e) {
        // Don't process keys if we're in a menu
        if (this.game.state === 'menu') return;

        switch (e.key) {
            case '1':
                this.selectTowerType('basic');
                break;
            case '2':
                this.selectTowerType('sniper');
                break;
            case '3':
                this.selectTowerType('splash');
                break;
            case '4':
                this.selectTowerType('slow');
                break;
            case 'Escape':
                if (this.selectedTowerType) {
                    this.cancelPlacement();
                } else if (this.game.selectedTower) {
                    this.game.deselectTower();
                } else {
                    this.game.togglePause();
                }
                break;
            case ' ':
                e.preventDefault();
                this.game.togglePause();
                break;
            case 'u':
            case 'U':
                this.game.upgradeSelectedTower();
                break;
            case 's':
            case 'S':
                // Only sell if we're not in a text input
                if (document.activeElement.tagName !== 'INPUT') {
                    this.game.sellSelectedTower();
                }
                break;
        }
    }

    selectTowerType(type) {
        const cost = this.game.economy.getTowerCost(type);
        if (this.game.economy.canAfford(cost)) {
            this.selectedTowerType = type;
            this.canvas.style.cursor = 'crosshair';
            this.game.deselectTower();
            this.updatePlacementGhost(this.mouseX, this.mouseY);
        }
    }

    cancelPlacement() {
        this.selectedTowerType = null;
        this.placementGhost = null;
        this.canvas.style.cursor = 'crosshair';
    }

    updatePlacementGhost(x, y) {
        // Snap to grid center
        const gridX = Math.floor(x / TILE_SIZE) * TILE_SIZE + TILE_SIZE / 2;
        const gridY = Math.floor(y / TILE_SIZE) * TILE_SIZE + TILE_SIZE / 2;

        this.placementGhost = {
            x: gridX,
            y: gridY,
            valid: this.game.canPlaceTower(gridX, gridY)
        };
    }
}
