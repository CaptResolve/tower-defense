// Environment.js - Forest landscape rendering with hills, ponds, trees, and grass

import { GAME_WIDTH, GAME_HEIGHT } from './Game.js';

export class Environment {
    constructor(game) {
        this.game = game;
        this.grassDetails = [];
        this.backgroundGenerated = false;

        // Cached background canvas for performance
        this.bgCanvas = null;
        this.bgCtx = null;
    }

    init() {
        // Create offscreen canvas for static background
        this.bgCanvas = document.createElement('canvas');
        this.bgCanvas.width = GAME_WIDTH;
        this.bgCanvas.height = GAME_HEIGHT;
        this.bgCtx = this.bgCanvas.getContext('2d');
    }

    generateBackground(terrain) {
        if (!this.bgCtx) this.init();

        const ctx = this.bgCtx;

        // Clear
        ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        // 1. Sky/atmosphere gradient at top
        this.renderSky(ctx);

        // 2. Base grass field
        this.renderGrassBase(ctx);

        // 3. Grass texture details
        this.grassDetails = terrain.generateGrassDetails();
        this.renderGrassDetails(ctx);

        // 4. Hills (elevated terrain)
        this.renderHills(ctx, terrain.hills);

        // 5. Ponds
        this.renderPonds(ctx, terrain.ponds);

        // 6. Tree shadows (rendered before trees)
        this.renderTreeShadows(ctx, terrain.trees);

        this.backgroundGenerated = true;
    }

    renderSky(ctx) {
        // Subtle sky gradient at top for depth
        const skyGradient = ctx.createLinearGradient(0, 0, 0, 150);
        skyGradient.addColorStop(0, '#87CEEB');
        skyGradient.addColorStop(0.5, '#a8d8a8');
        skyGradient.addColorStop(1, '#4a7c4a');

        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, GAME_WIDTH, 150);

        // Distant hills silhouette
        ctx.fillStyle = '#3d6b3d';
        ctx.beginPath();
        ctx.moveTo(0, 150);

        // Wavy hill line
        for (let x = 0; x <= GAME_WIDTH; x += 50) {
            const y = 120 + Math.sin(x * 0.01) * 20 + Math.sin(x * 0.023) * 15;
            ctx.lineTo(x, y);
        }

        ctx.lineTo(GAME_WIDTH, 150);
        ctx.closePath();
        ctx.fill();
    }

    renderGrassBase(ctx) {
        // Main grass gradient
        const grassGradient = ctx.createLinearGradient(0, 100, 0, GAME_HEIGHT);
        grassGradient.addColorStop(0, '#4a8c4a');
        grassGradient.addColorStop(0.3, '#3d7a3d');
        grassGradient.addColorStop(0.7, '#2d6a2d');
        grassGradient.addColorStop(1, '#255a25');

        ctx.fillStyle = grassGradient;
        ctx.fillRect(0, 100, GAME_WIDTH, GAME_HEIGHT - 100);

        // Add subtle noise/texture
        this.addGrassNoise(ctx);
    }

    addGrassNoise(ctx) {
        // Add subtle color variation patches
        for (let i = 0; i < 150; i++) {
            const x = Math.random() * GAME_WIDTH;
            const y = 150 + Math.random() * (GAME_HEIGHT - 200);
            const radius = 20 + Math.random() * 60;

            const brightness = Math.random() > 0.5 ? 1.1 : 0.9;
            ctx.fillStyle = brightness > 1
                ? 'rgba(80, 160, 80, 0.15)'
                : 'rgba(30, 80, 30, 0.15)';

            ctx.beginPath();
            ctx.ellipse(x, y, radius, radius * 0.6, Math.random() * Math.PI, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    renderGrassDetails(ctx) {
        // Individual grass blade clusters
        for (const grass of this.grassDetails) {
            this.renderGrassCluster(ctx, grass.x, grass.y, grass.height, grass.angle, grass.shade);
        }
    }

    renderGrassCluster(ctx, x, y, height, angle, shade) {
        const baseGreen = Math.floor(100 * shade);
        const tipGreen = Math.floor(140 * shade);

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        // 3-5 blades per cluster
        const bladeCount = 3 + Math.floor(Math.random() * 3);

        for (let i = 0; i < bladeCount; i++) {
            const bladeAngle = (i - bladeCount / 2) * 0.15;
            const bladeHeight = height * (0.7 + Math.random() * 0.3);

            ctx.save();
            ctx.rotate(bladeAngle);

            ctx.strokeStyle = `rgb(40, ${baseGreen + Math.random() * 20}, 40)`;
            ctx.lineWidth = 1.5;
            ctx.lineCap = 'round';

            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(bladeAngle * 3, -bladeHeight * 0.6, bladeAngle * 5, -bladeHeight);
            ctx.stroke();

            ctx.restore();
        }

        ctx.restore();
    }

    renderHills(ctx, hills) {
        for (const hill of hills) {
            this.renderHill(ctx, hill);
        }
    }

    renderHill(ctx, hill) {
        const { x, y, radius } = hill;

        // Hill shadow
        ctx.fillStyle = 'rgba(20, 50, 20, 0.3)';
        ctx.beginPath();
        ctx.ellipse(x + radius * 0.2, y + radius * 0.15, radius * 1.1, radius * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Hill base gradient (lighter on top for 3D effect)
        const hillGradient = ctx.createRadialGradient(
            x - radius * 0.3, y - radius * 0.3, 0,
            x, y, radius
        );
        hillGradient.addColorStop(0, '#5ca05c');
        hillGradient.addColorStop(0.5, '#4a904a');
        hillGradient.addColorStop(0.8, '#3d7a3d');
        hillGradient.addColorStop(1, '#2d6a2d');

        ctx.fillStyle = hillGradient;
        ctx.beginPath();
        ctx.ellipse(x, y, radius, radius * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();

        // Hill highlight rim
        ctx.strokeStyle = 'rgba(100, 180, 100, 0.4)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y - radius * 0.1, radius * 0.7, Math.PI * 1.2, Math.PI * 1.8);
        ctx.stroke();

        // Grass tufts on hill
        for (let i = 0; i < 8; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * radius * 0.7;
            const gx = x + Math.cos(angle) * dist;
            const gy = y + Math.sin(angle) * dist * 0.45;

            this.renderGrassCluster(ctx, gx, gy, 5 + Math.random() * 4, Math.random() * 0.3, 1.1);
        }
    }

    renderPonds(ctx, ponds) {
        for (const pond of ponds) {
            this.renderPond(ctx, pond);
        }
    }

    renderPond(ctx, pond) {
        const { x, y, radius } = pond;

        // Pond edge/bank
        ctx.fillStyle = '#5a6a4a';
        ctx.beginPath();
        this.drawWavyCircle(ctx, x, y, radius + 8, 6, 3);
        ctx.fill();

        // Water gradient
        const waterGradient = ctx.createRadialGradient(
            x - radius * 0.3, y - radius * 0.3, 0,
            x, y, radius
        );
        waterGradient.addColorStop(0, '#6ab4d4');
        waterGradient.addColorStop(0.4, '#4a9bc4');
        waterGradient.addColorStop(0.8, '#3a8ab4');
        waterGradient.addColorStop(1, '#2a7aa4');

        ctx.fillStyle = waterGradient;
        ctx.beginPath();
        this.drawWavyCircle(ctx, x, y, radius, 6, 2);
        ctx.fill();

        // Water reflection/shine
        ctx.fillStyle = 'rgba(200, 230, 255, 0.3)';
        ctx.beginPath();
        ctx.ellipse(x - radius * 0.3, y - radius * 0.2, radius * 0.4, radius * 0.2, -0.3, 0, Math.PI * 2);
        ctx.fill();

        // Lily pads
        this.renderLilyPads(ctx, x, y, radius);

        // Subtle ripples
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;
        for (let r = radius * 0.3; r < radius * 0.9; r += radius * 0.25) {
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 0.5);
            ctx.stroke();
        }
    }

    drawWavyCircle(ctx, x, y, radius, waves, amplitude) {
        ctx.moveTo(x + radius, y);

        for (let angle = 0; angle <= Math.PI * 2; angle += 0.1) {
            const wave = Math.sin(angle * waves) * amplitude;
            const r = radius + wave;
            ctx.lineTo(x + Math.cos(angle) * r, y + Math.sin(angle) * r * 0.6);
        }

        ctx.closePath();
    }

    renderLilyPads(ctx, pondX, pondY, pondRadius) {
        const padCount = 2 + Math.floor(Math.random() * 3);

        for (let i = 0; i < padCount; i++) {
            const angle = (i / padCount) * Math.PI * 2 + Math.random() * 0.5;
            const dist = pondRadius * (0.3 + Math.random() * 0.4);
            const px = pondX + Math.cos(angle) * dist;
            const py = pondY + Math.sin(angle) * dist * 0.6;
            const padRadius = 6 + Math.random() * 6;

            // Lily pad
            ctx.fillStyle = '#2d7a2d';
            ctx.beginPath();
            ctx.arc(px, py, padRadius, 0.3, Math.PI * 2 - 0.3);
            ctx.lineTo(px, py);
            ctx.fill();

            // Optional flower
            if (Math.random() > 0.6) {
                ctx.fillStyle = '#ffaacc';
                ctx.beginPath();
                ctx.arc(px, py - 2, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    renderTreeShadows(ctx, trees) {
        ctx.fillStyle = 'rgba(20, 40, 20, 0.35)';

        for (const tree of trees) {
            const shadowRadius = tree.size === 'large' ? 40 : (tree.size === 'medium' ? 28 : 18);
            ctx.beginPath();
            ctx.ellipse(tree.x + 15, tree.y + 10, shadowRadius, shadowRadius * 0.4, 0.2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Render the cached background
    renderBackground(ctx) {
        if (this.bgCanvas) {
            ctx.drawImage(this.bgCanvas, 0, 0);
        }
    }

    // Render trees (called after towers so trees can overlap)
    renderTrees(ctx, trees) {
        // Sort by Y position for depth
        const sortedTrees = [...trees].sort((a, b) => a.y - b.y);

        for (const tree of sortedTrees) {
            this.renderTree(ctx, tree);
        }
    }

    renderTree(ctx, tree) {
        const { x, y, size } = tree;

        const trunkWidth = size === 'large' ? 14 : (size === 'medium' ? 10 : 6);
        const trunkHeight = size === 'large' ? 35 : (size === 'medium' ? 25 : 15);
        const canopyRadius = size === 'large' ? 35 : (size === 'medium' ? 25 : 16);

        ctx.save();
        ctx.globalAlpha = 0.92; // Slight transparency for gameplay

        // Trunk
        const trunkGradient = ctx.createLinearGradient(x - trunkWidth / 2, y, x + trunkWidth / 2, y);
        trunkGradient.addColorStop(0, '#4a3525');
        trunkGradient.addColorStop(0.5, '#6b4a35');
        trunkGradient.addColorStop(1, '#3a2a1a');

        ctx.fillStyle = trunkGradient;
        ctx.beginPath();
        ctx.moveTo(x - trunkWidth / 2, y);
        ctx.lineTo(x - trunkWidth / 3, y - trunkHeight);
        ctx.lineTo(x + trunkWidth / 3, y - trunkHeight);
        ctx.lineTo(x + trunkWidth / 2, y);
        ctx.closePath();
        ctx.fill();

        // Bark texture
        ctx.strokeStyle = '#3a2515';
        ctx.lineWidth = 1;
        for (let i = 1; i < 4; i++) {
            const ty = y - (trunkHeight / 4) * i;
            ctx.beginPath();
            ctx.moveTo(x - trunkWidth / 3, ty);
            ctx.lineTo(x + trunkWidth / 4, ty + 3);
            ctx.stroke();
        }

        // Canopy (multiple overlapping circles for fullness)
        const canopyY = y - trunkHeight - canopyRadius * 0.5;

        // Canopy shadow/depth layer
        ctx.fillStyle = '#1a4a1a';
        ctx.beginPath();
        ctx.arc(x, canopyY + 5, canopyRadius * 0.9, 0, Math.PI * 2);
        ctx.fill();

        // Main canopy
        const canopyGradient = ctx.createRadialGradient(
            x - canopyRadius * 0.3, canopyY - canopyRadius * 0.3, 0,
            x, canopyY, canopyRadius
        );
        canopyGradient.addColorStop(0, '#4a9a4a');
        canopyGradient.addColorStop(0.5, '#3a8a3a');
        canopyGradient.addColorStop(1, '#2a6a2a');

        ctx.fillStyle = canopyGradient;

        // Multiple overlapping circles for natural shape
        const circles = [
            { dx: 0, dy: 0, r: 1 },
            { dx: -0.4, dy: 0.2, r: 0.7 },
            { dx: 0.4, dy: 0.15, r: 0.75 },
            { dx: 0, dy: -0.4, r: 0.65 },
            { dx: -0.3, dy: -0.25, r: 0.5 },
            { dx: 0.35, dy: -0.3, r: 0.55 }
        ];

        for (const c of circles) {
            ctx.beginPath();
            ctx.arc(
                x + c.dx * canopyRadius,
                canopyY + c.dy * canopyRadius,
                canopyRadius * c.r,
                0, Math.PI * 2
            );
            ctx.fill();
        }

        // Canopy highlights
        ctx.fillStyle = 'rgba(100, 180, 100, 0.3)';
        ctx.beginPath();
        ctx.arc(x - canopyRadius * 0.3, canopyY - canopyRadius * 0.3, canopyRadius * 0.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}
