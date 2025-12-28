// UI.js - In-game HUD and UI elements

import { GAME_WIDTH, GAME_HEIGHT } from '../engine/Game.js';

export class UI {
    constructor(game) {
        this.game = game;

        // Tower selection buttons
        this.towerButtons = [
            { type: 'basic', key: '1', x: 20, y: 20, w: 50, h: 50 },
            { type: 'sniper', key: '2', x: 80, y: 20, w: 50, h: 50 },
            { type: 'splash', key: '3', x: 140, y: 20, w: 50, h: 50 },
            { type: 'slow', key: '4', x: 200, y: 20, w: 50, h: 50 }
        ];

        // Tower colors (medieval theme)
        this.towerColors = {
            basic: '#8b7d6b',
            sniper: '#9c8b7a',
            splash: '#8b7060',
            slow: '#706080'
        };

        // Action buttons (shown when tower selected)
        this.actionButtons = [
            { action: 'upgrade', label: 'Upgrade (U)', x: GAME_WIDTH - 150, y: GAME_HEIGHT - 100, w: 130, h: 35 },
            { action: 'sell', label: 'Sell (S)', x: GAME_WIDTH - 150, y: GAME_HEIGHT - 55, w: 130, h: 35 }
        ];

        // Skip wave button
        this.skipButton = { x: GAME_WIDTH / 2 - 60, y: 15, w: 120, h: 30 };

        // Player upgrade buttons (near the ballista at bottom)
        this.playerUpgradeButtons = [
            { upgrade: 'fireRate', x: GAME_WIDTH / 2 - 160, y: GAME_HEIGHT - 70, w: 140, h: 55 },
            { upgrade: 'damage', x: GAME_WIDTH / 2 + 20, y: GAME_HEIGHT - 70, w: 140, h: 55 }
        ];
    }

    handleClick(x, y, game) {
        // Check tower buttons
        for (const btn of this.towerButtons) {
            if (x >= btn.x && x < btn.x + btn.w && y >= btn.y && y < btn.y + btn.h) {
                game.input.selectTowerType(btn.type);
                return true;
            }
        }

        // Check player upgrade buttons
        for (const btn of this.playerUpgradeButtons) {
            if (x >= btn.x && x < btn.x + btn.w && y >= btn.y && y < btn.y + btn.h) {
                if (btn.upgrade === 'fireRate') {
                    game.player.upgradeFireRate();
                } else if (btn.upgrade === 'damage') {
                    game.player.upgradeDamage();
                }
                return true;
            }
        }

        // Check action buttons (if tower selected)
        if (game.selectedTower) {
            for (const btn of this.actionButtons) {
                if (x >= btn.x && x < btn.x + btn.w && y >= btn.y && y < btn.y + btn.h) {
                    if (btn.action === 'upgrade') {
                        game.upgradeSelectedTower();
                    } else if (btn.action === 'sell') {
                        game.sellSelectedTower();
                    }
                    return true;
                }
            }
        }

        // Check skip wave button
        const progress = game.waveManager.getProgress();
        if (progress.state === 'waiting') {
            const btn = this.skipButton;
            if (x >= btn.x && x < btn.x + btn.w && y >= btn.y && y < btn.y + btn.h) {
                game.waveManager.skipWaveDelay();
                return true;
            }
        }

        return false;
    }

    render(ctx, game) {
        // Render HUD elements
        this.renderTopBar(ctx, game);
        this.renderTowerButtons(ctx, game);
        this.renderWaveInfo(ctx, game);
        this.renderPlayerUpgrades(ctx, game);

        // Render selected tower info
        if (game.selectedTower) {
            this.renderSelectedTowerInfo(ctx, game);
        }

        // Render tower placement tooltip
        if (game.input.selectedTowerType) {
            this.renderPlacementTooltip(ctx, game);
        }
    }

    renderTopBar(ctx, game) {
        // Gold display
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(GAME_WIDTH - 180, 15, 160, 40);

        ctx.fillStyle = '#ffd43b';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(`${game.economy.gold}`, GAME_WIDTH - 30, 45);

        ctx.fillStyle = '#ffd43b';
        ctx.font = '16px Arial';
        ctx.fillText('Gold:', GAME_WIDTH - 100, 45);

        // Lives display
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(GAME_WIDTH - 350, 15, 150, 40);

        ctx.fillStyle = '#ff6b6b';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(`${game.lives}/${game.maxLives}`, GAME_WIDTH - 200, 45);

        ctx.fillStyle = '#ff6b6b';
        ctx.font = '16px Arial';
        ctx.fillText('\u2764', GAME_WIDTH - 330, 45);

        // Level display
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(GAME_WIDTH - 520, 15, 150, 40);

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Level ${game.levelId}`, GAME_WIDTH - 445, 42);
    }

    renderTowerButtons(ctx, game) {
        for (const btn of this.towerButtons) {
            const cost = game.economy.getTowerCost(btn.type);
            const canAfford = game.economy.canAfford(cost);
            const isSelected = game.input.selectedTowerType === btn.type;

            // Button background
            ctx.fillStyle = isSelected ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.6)';
            ctx.fillRect(btn.x, btn.y, btn.w, btn.h);

            // Border
            ctx.strokeStyle = isSelected ? '#fff' : (canAfford ? this.towerColors[btn.type] : '#666');
            ctx.lineWidth = isSelected ? 3 : 2;
            ctx.strokeRect(btn.x, btn.y, btn.w, btn.h);

            // Draw mini tower icon
            this.renderMiniTower(ctx, btn.x + btn.w / 2, btn.y + 22, btn.type, canAfford);

            // Cost
            ctx.fillStyle = canAfford ? '#fff' : '#888';
            ctx.font = '11px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${cost}`, btn.x + btn.w / 2, btn.y + btn.h - 5);

            // Key hint
            ctx.fillStyle = '#888';
            ctx.font = '10px Arial';
            ctx.textAlign = 'right';
            ctx.fillText(btn.key, btn.x + btn.w - 5, btn.y + 12);
        }
    }

    renderMiniTower(ctx, x, y, type, enabled) {
        ctx.save();
        ctx.translate(x, y);

        const color = enabled ? this.towerColors[type] : '#666';
        const darkColor = enabled ? this.darkenColor(this.towerColors[type]) : '#444';

        if (type === 'basic') {
            // Guard tower - simple castle tower
            ctx.fillStyle = darkColor;
            ctx.fillRect(-10, 2, 20, 6);
            ctx.fillStyle = color;
            ctx.fillRect(-8, -12, 16, 16);
            // Crenellations
            ctx.fillRect(-10, -15, 5, 4);
            ctx.fillRect(5, -15, 5, 4);
            // Window
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(-2, -8, 4, 6);
        } else if (type === 'sniper') {
            // Watchtower - tall thin tower
            ctx.fillStyle = darkColor;
            ctx.fillRect(-8, 2, 16, 6);
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(-6, 5);
            ctx.lineTo(-4, -15);
            ctx.lineTo(4, -15);
            ctx.lineTo(6, 5);
            ctx.closePath();
            ctx.fill();
            // Pointed roof
            ctx.fillStyle = '#4a3728';
            ctx.beginPath();
            ctx.moveTo(-5, -15);
            ctx.lineTo(0, -22);
            ctx.lineTo(5, -15);
            ctx.closePath();
            ctx.fill();
        } else if (type === 'splash') {
            // Siege tower - catapult
            ctx.fillStyle = darkColor;
            ctx.fillRect(-12, 0, 24, 8);
            ctx.fillStyle = color;
            ctx.fillRect(-10, -8, 20, 10);
            // Catapult arm
            ctx.fillStyle = '#5c4033';
            ctx.save();
            ctx.rotate(-0.4);
            ctx.fillRect(-2, -18, 4, 14);
            // Bucket
            ctx.fillStyle = '#ff6b35';
            ctx.beginPath();
            ctx.arc(0, -20, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        } else if (type === 'slow') {
            // Mage tower - round with crystal
            ctx.fillStyle = darkColor;
            ctx.beginPath();
            ctx.ellipse(0, 4, 10, 4, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = color;
            ctx.fillRect(-8, -10, 16, 16);
            ctx.beginPath();
            ctx.ellipse(0, -10, 8, 3, 0, 0, Math.PI * 2);
            ctx.fill();
            // Crystal
            ctx.fillStyle = '#88ccff';
            ctx.beginPath();
            ctx.moveTo(0, -20);
            ctx.lineTo(-4, -12);
            ctx.lineTo(0, -10);
            ctx.lineTo(4, -12);
            ctx.closePath();
            ctx.fill();
        }

        ctx.restore();
    }

    darkenColor(hex) {
        const num = parseInt(hex.slice(1), 16);
        const r = Math.max(0, (num >> 16) - 40);
        const g = Math.max(0, ((num >> 8) & 0x00FF) - 40);
        const b = Math.max(0, (num & 0x0000FF) - 40);
        return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
    }

    renderWaveInfo(ctx, game) {
        const progress = game.waveManager.getProgress();

        // Wave counter
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(GAME_WIDTH / 2 - 80, 60, 160, 30);

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Wave ${progress.current}/${progress.total}`, GAME_WIDTH / 2, 82);

        // Skip button or status
        if (progress.state === 'waiting' && progress.current < progress.total) {
            const btn = this.skipButton;

            ctx.fillStyle = 'rgba(74, 144, 217, 0.8)';
            ctx.fillRect(btn.x, btn.y, btn.w, btn.h);

            ctx.strokeStyle = '#5ba0e9';
            ctx.lineWidth = 2;
            ctx.strokeRect(btn.x, btn.y, btn.w, btn.h);

            const countdown = Math.ceil(progress.countdown);
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`Next Wave (${countdown}s)`, btn.x + btn.w / 2, btn.y + 20);
        } else if (progress.state === 'spawning' || progress.state === 'active') {
            ctx.fillStyle = '#ffa94d';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Wave in progress...', GAME_WIDTH / 2, 35);
        }
    }

    renderSelectedTowerInfo(ctx, game) {
        const tower = game.selectedTower;

        // Info panel
        const panelX = GAME_WIDTH - 170;
        const panelY = GAME_HEIGHT - 180;
        const panelW = 160;
        const panelH = 170;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(panelX, panelY, panelW, panelH);
        ctx.strokeStyle = this.towerColors[tower.type];
        ctx.lineWidth = 2;
        ctx.strokeRect(panelX, panelY, panelW, panelH);

        // Tower name
        const info = game.economy.getTowerInfo(tower.type);
        ctx.fillStyle = this.towerColors[tower.type];
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(info.name, panelX + panelW / 2, panelY + 20);

        // Level
        ctx.fillStyle = '#ffd43b';
        ctx.font = '12px Arial';
        ctx.fillText(`Level ${tower.level}/3`, panelX + panelW / 2, panelY + 38);

        // Stats
        ctx.fillStyle = '#ccc';
        ctx.font = '11px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Damage: ${tower.damage}`, panelX + 10, panelY + 58);
        ctx.fillText(`Range: ${tower.range}`, panelX + 10, panelY + 73);
        ctx.fillText(`Fire Rate: ${tower.fireRate.toFixed(2)}s`, panelX + 10, panelY + 88);

        // Action buttons
        for (const btn of this.actionButtons) {
            let enabled = true;
            let label = btn.label;

            if (btn.action === 'upgrade') {
                if (tower.level >= 3) {
                    enabled = false;
                    label = 'MAX LEVEL';
                } else {
                    const cost = game.economy.getUpgradeCost(tower);
                    enabled = game.economy.canAfford(cost);
                    label = `Upgrade (${cost}g)`;
                }
            } else if (btn.action === 'sell') {
                const value = game.economy.getSellValue(tower);
                label = `Sell (+${value}g)`;
            }

            ctx.fillStyle = enabled ? 'rgba(74, 144, 217, 0.8)' : 'rgba(100, 100, 100, 0.8)';
            ctx.fillRect(btn.x, btn.y, btn.w, btn.h);

            ctx.strokeStyle = enabled ? '#5ba0e9' : '#666';
            ctx.lineWidth = 1;
            ctx.strokeRect(btn.x, btn.y, btn.w, btn.h);

            ctx.fillStyle = enabled ? '#fff' : '#888';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(label, btn.x + btn.w / 2, btn.y + 22);
        }
    }

    renderPlacementTooltip(ctx, game) {
        const type = game.input.selectedTowerType;
        const info = game.economy.getTowerInfo(type);
        const cost = game.economy.getTowerCost(type);

        // Tooltip at bottom left
        const tooltipX = 20;
        const tooltipY = GAME_HEIGHT - 80;
        const tooltipW = 200;
        const tooltipH = 70;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(tooltipX, tooltipY, tooltipW, tooltipH);
        ctx.strokeStyle = this.towerColors[type];
        ctx.lineWidth = 2;
        ctx.strokeRect(tooltipX, tooltipY, tooltipW, tooltipH);

        ctx.fillStyle = this.towerColors[type];
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`${info.name} - ${cost}g`, tooltipX + 10, tooltipY + 20);

        ctx.fillStyle = '#ccc';
        ctx.font = '11px Arial';
        ctx.fillText(info.description, tooltipX + 10, tooltipY + 40, tooltipW - 20);

        ctx.fillStyle = '#888';
        ctx.font = '10px Arial';
        ctx.fillText('Click to place, Right-click to cancel', tooltipX + 10, tooltipY + 58);
    }

    renderPlayerUpgrades(ctx, game) {
        const upgradeInfo = game.economy.getPlayerUpgradeInfo();

        for (const btn of this.playerUpgradeButtons) {
            const info = btn.upgrade === 'fireRate' ? upgradeInfo.fireRate : upgradeInfo.damage;
            const isMaxed = info.level >= info.maxLevel;
            const canAfford = info.canAfford;

            // Button background - medieval parchment style
            ctx.fillStyle = 'rgba(60, 50, 40, 0.85)';
            ctx.fillRect(btn.x, btn.y, btn.w, btn.h);

            // Border - golden for affordable, gray for maxed/unaffordable
            ctx.strokeStyle = isMaxed ? '#4a4a3a' : (canAfford ? '#c9a227' : '#6a6a5a');
            ctx.lineWidth = 2;
            ctx.strokeRect(btn.x, btn.y, btn.w, btn.h);

            // Corner decorations
            const cornerSize = 6;
            ctx.fillStyle = isMaxed ? '#4a4a3a' : (canAfford ? '#c9a227' : '#6a6a5a');
            ctx.fillRect(btn.x, btn.y, cornerSize, cornerSize);
            ctx.fillRect(btn.x + btn.w - cornerSize, btn.y, cornerSize, cornerSize);
            ctx.fillRect(btn.x, btn.y + btn.h - cornerSize, cornerSize, cornerSize);
            ctx.fillRect(btn.x + btn.w - cornerSize, btn.y + btn.h - cornerSize, cornerSize, cornerSize);

            // Title
            ctx.fillStyle = isMaxed ? '#8a8a7a' : (canAfford ? '#fff' : '#aaa');
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';

            const title = btn.upgrade === 'fireRate' ? 'Fire Rate' : 'Damage';
            ctx.fillText(title, btn.x + btn.w / 2, btn.y + 15);

            // Level indicator
            ctx.fillStyle = '#c9a227';
            ctx.font = '11px Arial';
            ctx.fillText(`Lv ${info.level}/${info.maxLevel}`, btn.x + btn.w / 2, btn.y + 28);

            // Current value
            ctx.fillStyle = '#aaa';
            ctx.font = '10px Arial';
            const valueText = btn.upgrade === 'fireRate'
                ? `${info.current}`
                : `${info.current} dmg`;
            ctx.fillText(valueText, btn.x + btn.w / 2, btn.y + 40);

            // Cost or MAX text
            if (isMaxed) {
                ctx.fillStyle = '#6a6a5a';
                ctx.font = 'bold 11px Arial';
                ctx.fillText('MAX', btn.x + btn.w / 2, btn.y + 52);
            } else {
                ctx.fillStyle = canAfford ? '#ffd43b' : '#8a7a6a';
                ctx.font = '11px Arial';
                ctx.fillText(`${info.nextCost}g`, btn.x + btn.w / 2, btn.y + 52);
            }
        }

        // Add ballista label above buttons
        ctx.fillStyle = 'rgba(60, 50, 40, 0.7)';
        ctx.fillRect(GAME_WIDTH / 2 - 50, GAME_HEIGHT - 85, 100, 16);
        ctx.fillStyle = '#c9a227';
        ctx.font = 'bold 11px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('BALLISTA', GAME_WIDTH / 2, GAME_HEIGHT - 73);
    }
}
