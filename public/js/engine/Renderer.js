// Renderer.js - Natural terrain canvas rendering utilities

import { TILE_SIZE, GAME_WIDTH, GAME_HEIGHT } from './Game.js';

export class Renderer {
    constructor() {
        this.towerColors = {
            basic: { primary: '#8b7d6b', secondary: '#5c524a', dark: '#3d3632' },
            sniper: { primary: '#9c8b7a', secondary: '#6b5d52', dark: '#4a3f38' },
            splash: { primary: '#8b7060', secondary: '#5c4540', dark: '#3d2d28' },
            slow: { primary: '#706080', secondary: '#4a4060', dark: '#2a2040' }
        };

        // Natural dirt path colors
        this.pathColors = {
            dirtDark: '#6b5040',
            dirt: '#8b6b50',
            dirtLight: '#a08565',
            grassBlend: '#5a7a4a'
        };

        // Cached path canvas (rendered once per level)
        this.pathCanvas = null;
        this.pathCtx = null;
        this.cachedPath = null;
    }

    // Initialize path cache for a new level
    initPathCache(path) {
        if (!this.pathCanvas) {
            this.pathCanvas = document.createElement('canvas');
            this.pathCanvas.width = GAME_WIDTH;
            this.pathCanvas.height = GAME_HEIGHT;
            this.pathCtx = this.pathCanvas.getContext('2d');
        }

        // Clear and render path to cache
        this.pathCtx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        this.renderPathToCache(this.pathCtx, path);
        this.cachedPath = path;
    }

    renderPath(ctx, path) {
        if (!path || path.length < 2) return;

        // Use cached path if available
        if (this.pathCanvas && this.cachedPath === path) {
            ctx.drawImage(this.pathCanvas, 0, 0);
            return;
        }

        // Initialize cache if not done yet
        this.initPathCache(path);
        ctx.drawImage(this.pathCanvas, 0, 0);
    }

    // Render path to cache canvas (called once per level)
    renderPathToCache(ctx, path) {
        if (!path || path.length < 2) return;

        ctx.save();

        // Layer 1: Grass-dirt blend outer edge (soft transition)
        this.renderPathLayer(ctx, path, TILE_SIZE + 25, 'rgba(90, 122, 74, 0.5)');

        // Layer 2: Outer dirt edge with grass blend
        this.renderPathLayer(ctx, path, TILE_SIZE + 15, 'rgba(107, 80, 64, 0.6)');

        // Layer 3: Main dirt path
        this.renderPathLayer(ctx, path, TILE_SIZE + 5, this.pathColors.dirtDark);

        // Layer 4: Inner dirt (worn center)
        this.renderPathLayer(ctx, path, TILE_SIZE - 5, this.pathColors.dirt);

        // Layer 5: Center worn track
        this.renderPathLayer(ctx, path, TILE_SIZE - 15, this.pathColors.dirtLight);

        // Add natural texture and grass edges
        this.renderPathTexture(ctx, path);
        this.renderPathGrassEdges(ctx, path);

        ctx.restore();
    }

    renderPathLayer(ctx, path, width, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);

        for (let i = 1; i < path.length; i++) {
            ctx.lineTo(path[i].x, path[i].y);
        }

        ctx.stroke();
    }

    renderPathTexture(ctx, path) {
        // Add subtle dirt patches and worn spots
        for (let i = 0; i < path.length - 1; i++) {
            const p1 = path[i];
            const p2 = path[i + 1];
            const dist = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
            const steps = Math.floor(dist / 12);

            for (let j = 0; j < steps; j++) {
                const t = j / steps;
                const x = p1.x + (p2.x - p1.x) * t;
                const y = p1.y + (p2.y - p1.y) * t;

                // Random offset within path width
                const offsetX = (Math.random() - 0.5) * TILE_SIZE * 0.7;
                const offsetY = (Math.random() - 0.5) * TILE_SIZE * 0.7;

                // Dirt patches (darker spots)
                if (Math.random() > 0.6) {
                    ctx.fillStyle = `rgba(80, 60, 45, ${0.15 + Math.random() * 0.15})`;
                    ctx.beginPath();
                    ctx.ellipse(
                        x + offsetX, y + offsetY,
                        3 + Math.random() * 6, 2 + Math.random() * 4,
                        Math.random() * Math.PI, 0, Math.PI * 2
                    );
                    ctx.fill();
                }

                // Pebbles
                if (Math.random() > 0.85) {
                    ctx.fillStyle = `rgba(120, 100, 80, ${0.3 + Math.random() * 0.3})`;
                    ctx.beginPath();
                    ctx.arc(x + offsetX, y + offsetY, 1.5 + Math.random() * 2, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Footprints (subtle depressions)
                if (Math.random() > 0.95) {
                    ctx.fillStyle = 'rgba(60, 45, 35, 0.2)';
                    ctx.beginPath();
                    ctx.ellipse(
                        x + offsetX * 0.3, y + offsetY * 0.3,
                        4, 6, Math.atan2(p2.y - p1.y, p2.x - p1.x), 0, Math.PI * 2
                    );
                    ctx.fill();
                }
            }
        }
    }

    renderPathGrassEdges(ctx, path) {
        // Grass tufts along path edges
        for (let i = 0; i < path.length - 1; i++) {
            const p1 = path[i];
            const p2 = path[i + 1];
            const dist = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
            const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
            const perpAngle = angle + Math.PI / 2;

            const steps = Math.floor(dist / 8);

            for (let j = 0; j < steps; j++) {
                const t = j / steps;
                const baseX = p1.x + (p2.x - p1.x) * t;
                const baseY = p1.y + (p2.y - p1.y) * t;

                // Grass on both sides of path
                for (let side = -1; side <= 1; side += 2) {
                    const edgeDist = (TILE_SIZE / 2) + 8 + Math.random() * 12;
                    const gx = baseX + Math.cos(perpAngle) * edgeDist * side;
                    const gy = baseY + Math.sin(perpAngle) * edgeDist * side;

                    // Skip if too far from visible area
                    if (gx < -20 || gx > 1300 || gy < -20 || gy > 740) continue;

                    this.renderGrassTuft(ctx, gx, gy, 4 + Math.random() * 4);
                }
            }
        }
    }

    renderGrassTuft(ctx, x, y, height) {
        const bladeCount = 3 + Math.floor(Math.random() * 3);

        for (let i = 0; i < bladeCount; i++) {
            const bladeAngle = (i - bladeCount / 2) * 0.2 + (Math.random() - 0.5) * 0.3;
            const bladeHeight = height * (0.6 + Math.random() * 0.4);

            // Gradient from dark base to lighter tip
            const green = 80 + Math.floor(Math.random() * 40);
            ctx.strokeStyle = `rgb(40, ${green}, 35)`;
            ctx.lineWidth = 1.5;
            ctx.lineCap = 'round';

            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.quadraticCurveTo(
                x + bladeAngle * bladeHeight * 0.5, y - bladeHeight * 0.6,
                x + bladeAngle * bladeHeight, y - bladeHeight
            );
            ctx.stroke();
        }
    }

    renderPlacementGhost(ctx, ghost, towerType, onHill = false) {
        ctx.save();

        const colors = this.towerColors[towerType];
        const alpha = ghost.valid ? 0.7 : 0.4;
        const rangeBonus = onHill ? 1.2 : 1.0;
        const range = this.getTowerRange(towerType) * rangeBonus;

        // Draw range circle
        ctx.beginPath();
        ctx.arc(ghost.x, ghost.y, range, 0, Math.PI * 2);

        if (ghost.valid) {
            // Green for valid, brighter if on hill
            const fillAlpha = onHill ? 0.2 : 0.15;
            ctx.fillStyle = `rgba(74, 107, 58, ${fillAlpha})`;
            ctx.strokeStyle = onHill ? 'rgba(100, 180, 80, 0.6)' : 'rgba(74, 107, 58, 0.5)';
        } else {
            ctx.fillStyle = 'rgba(139, 69, 69, 0.15)';
            ctx.strokeStyle = 'rgba(139, 69, 69, 0.5)';
        }

        ctx.fill();
        ctx.lineWidth = 2;
        ctx.stroke();

        // Hill bonus indicator
        if (onHill && ghost.valid) {
            ctx.fillStyle = 'rgba(255, 215, 0, 0.8)';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('+20% Range', ghost.x, ghost.y - range - 10);
        }

        // Draw tower preview
        ctx.globalAlpha = alpha;

        // Stone base
        ctx.fillStyle = '#5c524a';
        ctx.fillRect(ghost.x - 18, ghost.y - 18, 36, 36);
        ctx.strokeStyle = '#3d3632';
        ctx.lineWidth = 2;
        ctx.strokeRect(ghost.x - 18, ghost.y - 18, 36, 36);

        // Tower body hint
        ctx.fillStyle = colors.primary;
        ctx.fillRect(ghost.x - 14, ghost.y - 30, 28, 30);

        // Invalid X marker
        if (!ghost.valid) {
            ctx.globalAlpha = 0.8;
            ctx.strokeStyle = '#aa0000';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(ghost.x - 12, ghost.y - 12);
            ctx.lineTo(ghost.x + 12, ghost.y + 12);
            ctx.moveTo(ghost.x + 12, ghost.y - 12);
            ctx.lineTo(ghost.x - 12, ghost.y + 12);
            ctx.stroke();
        }

        ctx.restore();
    }

    // Render terrain type indicator during placement
    renderTerrainIndicator(ctx, x, y, terrainType, valid) {
        ctx.save();

        let text = '';
        let color = '#fff';

        switch (terrainType) {
            case 'hill':
                text = 'Hill (+Range)';
                color = '#90EE90';
                break;
            case 'water':
                text = 'Water (No Build)';
                color = '#ff6b6b';
                break;
            case 'tree':
                text = 'Tree (No Build)';
                color = '#ff6b6b';
                break;
            case 'path':
                text = 'Path (No Build)';
                color = '#ff6b6b';
                break;
            case 'field':
                text = 'Field';
                color = '#90EE90';
                break;
        }

        if (text) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(x - 50, y + 30, 100, 20);

            ctx.fillStyle = color;
            ctx.font = '11px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, x, y + 40);
        }

        ctx.restore();
    }

    getTowerRange(type) {
        const ranges = {
            basic: 150,
            sniper: 280,
            splash: 120,
            slow: 130
        };
        return ranges[type] || 150;
    }

    // Health bar rendering
    renderHealthBar(ctx, x, y, width, height, percentage, showBorder = true) {
        const halfWidth = width / 2;

        // Background
        ctx.fillStyle = '#2a2520';
        ctx.fillRect(x - halfWidth, y, width, height);

        // Health fill with color based on percentage
        let healthColor;
        if (percentage > 0.5) {
            healthColor = '#4a8a4a';
        } else if (percentage > 0.25) {
            healthColor = '#c9a227';
        } else {
            healthColor = '#8b3a3a';
        }

        ctx.fillStyle = healthColor;
        ctx.fillRect(x - halfWidth, y, width * Math.max(0, percentage), height);

        // Border
        if (showBorder) {
            ctx.strokeStyle = '#1a1510';
            ctx.lineWidth = 1;
            ctx.strokeRect(x - halfWidth, y, width, height);
        }
    }

    // Medieval crosshair rendering
    renderCrosshair(ctx, x, y) {
        ctx.save();

        ctx.strokeStyle = 'rgba(201, 162, 39, 0.8)';
        ctx.lineWidth = 2;

        // Outer circle
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.stroke();

        // Cross lines
        ctx.beginPath();
        ctx.moveTo(x - 20, y);
        ctx.lineTo(x - 8, y);
        ctx.moveTo(x + 8, y);
        ctx.lineTo(x + 20, y);
        ctx.moveTo(x, y - 20);
        ctx.lineTo(x, y - 8);
        ctx.moveTo(x, y + 8);
        ctx.lineTo(x, y + 20);
        ctx.stroke();

        // Center diamond
        ctx.fillStyle = 'rgba(201, 162, 39, 0.8)';
        ctx.beginPath();
        ctx.moveTo(x, y - 3);
        ctx.lineTo(x + 3, y);
        ctx.lineTo(x, y + 3);
        ctx.lineTo(x - 3, y);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }

    // Render hill indicator on placed towers
    renderHillIndicator(ctx, x, y) {
        ctx.save();

        // Small hill icon
        ctx.fillStyle = 'rgba(100, 180, 100, 0.8)';
        ctx.beginPath();
        ctx.moveTo(x - 8, y + 25);
        ctx.lineTo(x, y + 18);
        ctx.lineTo(x + 8, y + 25);
        ctx.closePath();
        ctx.fill();

        // Arrow up
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y + 28);
        ctx.lineTo(x, y + 22);
        ctx.moveTo(x - 3, y + 25);
        ctx.lineTo(x, y + 22);
        ctx.lineTo(x + 3, y + 25);
        ctx.stroke();

        ctx.restore();
    }
}
