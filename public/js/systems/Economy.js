// Economy.js - Gold and resource management

export class Economy {
    constructor(game) {
        this.game = game;
        this.gold = 0;
    }

    init(startingGold) {
        this.gold = startingGold || 200;
    }

    addGold(amount) {
        this.gold += amount;
    }

    spendGold(amount) {
        if (this.gold >= amount) {
            this.gold -= amount;
            return true;
        }
        return false;
    }

    canAfford(amount) {
        return this.gold >= amount;
    }

    // Tower costs
    getTowerCost(towerType) {
        const costs = {
            basic: 100,
            sniper: 200,
            splash: 175,
            slow: 125
        };
        return costs[towerType] || 100;
    }

    getUpgradeCost(tower) {
        if (tower.level >= 3) return Infinity;

        // Each upgrade costs 75% of base cost * level
        const baseCost = this.getTowerCost(tower.type);
        return Math.floor(baseCost * 0.75 * tower.level);
    }

    getSellValue(tower) {
        // Return 60% of total invested
        const baseCost = this.getTowerCost(tower.type);
        let totalInvested = baseCost;

        // Add upgrade costs
        for (let i = 1; i < tower.level; i++) {
            totalInvested += Math.floor(baseCost * 0.75 * i);
        }

        return Math.floor(totalInvested * 0.6);
    }

    // Player ballista upgrade costs
    getPlayerFireRateUpgradeCost(currentLevel) {
        // Fire rate upgrades: 50, 75, 100, 125, 150, 175, 200, 225, 250 (levels 1-9 -> 2-10)
        return 50 + (currentLevel - 1) * 25;
    }

    getPlayerDamageUpgradeCost(currentLevel) {
        // Damage upgrades: 75, 125, 200, 300 (levels 1-4 -> 2-5)
        const costs = [75, 125, 200, 300];
        return costs[currentLevel - 1] || 999;
    }

    // Get next upgrade info for UI
    getPlayerUpgradeInfo() {
        const player = this.game.player;
        return {
            fireRate: {
                level: player.fireRateLevel,
                maxLevel: player.maxFireRateLevel,
                current: player.fireRate.toFixed(2) + 's',
                nextCost: player.fireRateLevel < player.maxFireRateLevel
                    ? this.getPlayerFireRateUpgradeCost(player.fireRateLevel)
                    : null,
                canAfford: player.fireRateLevel < player.maxFireRateLevel
                    ? this.canAfford(this.getPlayerFireRateUpgradeCost(player.fireRateLevel))
                    : false
            },
            damage: {
                level: player.damageLevel,
                maxLevel: player.maxDamageLevel,
                current: player.damage,
                nextCost: player.damageLevel < player.maxDamageLevel
                    ? this.getPlayerDamageUpgradeCost(player.damageLevel)
                    : null,
                canAfford: player.damageLevel < player.maxDamageLevel
                    ? this.canAfford(this.getPlayerDamageUpgradeCost(player.damageLevel))
                    : false
            }
        };
    }

    // Tower info for UI
    getTowerInfo(towerType) {
        const info = {
            basic: {
                name: 'Guard Tower',
                cost: 100,
                description: 'Reliable archer tower with balanced stats.',
                stats: { damage: 40, range: 150, fireRate: 0.8 }
            },
            sniper: {
                name: 'Watchtower',
                cost: 200,
                description: 'Tall tower with long range crossbowmen.',
                stats: { damage: 120, range: 280, fireRate: 2.0 }
            },
            splash: {
                name: 'Siege Tower',
                cost: 175,
                description: 'Launches explosive pots at enemy groups.',
                stats: { damage: 35, range: 120, fireRate: 1.5, splash: 60 }
            },
            slow: {
                name: 'Mage Tower',
                cost: 125,
                description: 'Casts frost magic to slow enemies.',
                stats: { damage: 15, range: 130, fireRate: 0.5, slow: '60%' }
            }
        };
        return info[towerType] || info.basic;
    }
}
