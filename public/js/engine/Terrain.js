// Terrain.js - Terrain management and hit-testing for tower placement

import { TILE_SIZE } from './Game.js';

export class Terrain {
    constructor(game) {
        this.game = game;
        this.hills = [];
        this.ponds = [];
        this.trees = [];
        this.path = [];
        this.pathWidth = TILE_SIZE + 10; // Width for collision detection
    }

    loadFromLevel(levelData) {
        this.path = levelData.path || [];

        const terrain = levelData.terrain || {};
        this.hills = terrain.hills || [];
        this.ponds = terrain.ponds || [];
        this.trees = terrain.trees || [];
    }

    // Check if a point is on the path (non-buildable)
    isOnPath(x, y) {
        const margin = this.pathWidth / 2 + 20; // Extra margin for towers

        for (let i = 0; i < this.path.length - 1; i++) {
            const p1 = this.path[i];
            const p2 = this.path[i + 1];

            const dist = this.pointToLineDistance(x, y, p1.x, p1.y, p2.x, p2.y);
            if (dist < margin) {
                return true;
            }
        }
        return false;
    }

    // Check if a point is in a pond (non-buildable)
    isInPond(x, y) {
        for (const pond of this.ponds) {
            const dist = Math.sqrt((x - pond.x) ** 2 + (y - pond.y) ** 2);
            if (dist < pond.radius + 20) { // Add margin for tower size
                return true;
            }
        }
        return false;
    }

    // Check if a point is on a tree (non-buildable)
    isOnTree(x, y) {
        for (const tree of this.trees) {
            const treeRadius = tree.size === 'large' ? 35 : (tree.size === 'medium' ? 25 : 18);
            const dist = Math.sqrt((x - tree.x) ** 2 + (y - tree.y) ** 2);
            if (dist < treeRadius + 20) { // Add margin
                return true;
            }
        }
        return false;
    }

    // Check if a point is on a hill (range bonus)
    isOnHill(x, y) {
        for (const hill of this.hills) {
            const dist = Math.sqrt((x - hill.x) ** 2 + (y - hill.y) ** 2);
            if (dist < hill.radius * 0.8) { // Must be well within hill
                return true;
            }
        }
        return false;
    }

    // Get the hill at a position (for rendering purposes)
    getHillAt(x, y) {
        for (const hill of this.hills) {
            const dist = Math.sqrt((x - hill.x) ** 2 + (y - hill.y) ** 2);
            if (dist < hill.radius) {
                return hill;
            }
        }
        return null;
    }

    // Check if placement is valid (not on path, water, or trees)
    canPlaceAt(x, y) {
        if (this.isOnPath(x, y)) return false;
        if (this.isInPond(x, y)) return false;
        if (this.isOnTree(x, y)) return false;
        return true;
    }

    // Calculate distance from point to line segment
    pointToLineDistance(px, py, x1, y1, x2, y2) {
        const A = px - x1;
        const B = py - y1;
        const C = x2 - x1;
        const D = y2 - y1;

        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        let param = -1;

        if (lenSq !== 0) {
            param = dot / lenSq;
        }

        let xx, yy;

        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }

        const dx = px - xx;
        const dy = py - yy;

        return Math.sqrt(dx * dx + dy * dy);
    }

    // Get terrain type at position for UI feedback
    getTerrainType(x, y) {
        if (this.isOnPath(x, y)) return 'path';
        if (this.isInPond(x, y)) return 'water';
        if (this.isOnTree(x, y)) return 'tree';
        if (this.isOnHill(x, y)) return 'hill';
        return 'field';
    }

    // Generate procedural grass details (cached per level)
    generateGrassDetails() {
        const details = [];
        const spacing = 30;

        for (let x = 0; x < 1280; x += spacing) {
            for (let y = 0; y < 720; y += spacing) {
                // Skip if on path, water, or near trees
                if (this.isOnPath(x, y)) continue;
                if (this.isInPond(x, y)) continue;

                // Random offset for natural look
                const offsetX = (Math.random() - 0.5) * spacing * 0.8;
                const offsetY = (Math.random() - 0.5) * spacing * 0.8;

                details.push({
                    x: x + offsetX,
                    y: y + offsetY,
                    height: 3 + Math.random() * 5,
                    angle: (Math.random() - 0.5) * 0.4,
                    shade: 0.85 + Math.random() * 0.3
                });
            }
        }

        return details;
    }
}
