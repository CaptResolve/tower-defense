// towers.js - Tower configuration data

export const TOWER_CONFIG = {
    basic: {
        name: 'Basic Tower',
        cost: 100,
        range: 150,
        damage: 40,
        fireRate: 0.8,
        projectileSpeed: 500,
        description: 'A reliable all-purpose tower with balanced stats.',
        color: '#4dabf7',
        upgrades: [
            { damage: 56, range: 165, fireRate: 0.72 },
            { damage: 78, range: 181, fireRate: 0.65 }
        ]
    },
    sniper: {
        name: 'Sniper Tower',
        cost: 200,
        range: 280,
        damage: 120,
        fireRate: 2.0,
        projectileSpeed: 900,
        description: 'Long-range tower with high damage per shot.',
        color: '#69db7c',
        upgrades: [
            { damage: 168, range: 308, fireRate: 1.8 },
            { damage: 235, range: 339, fireRate: 1.6 }
        ]
    },
    splash: {
        name: 'Splash Tower',
        cost: 175,
        range: 120,
        damage: 35,
        fireRate: 1.5,
        projectileSpeed: 400,
        splashRadius: 60,
        description: 'Explosive projectiles deal area damage.',
        color: '#ffa94d',
        upgrades: [
            { damage: 49, range: 132, fireRate: 1.35, splashRadius: 72 },
            { damage: 69, range: 145, fireRate: 1.2, splashRadius: 86 }
        ]
    },
    slow: {
        name: 'Slow Tower',
        cost: 125,
        range: 130,
        damage: 15,
        fireRate: 0.5,
        projectileSpeed: 600,
        slowFactor: 0.4,
        slowDuration: 2,
        description: 'Slows enemies, making them easier targets.',
        color: '#b197fc',
        upgrades: [
            { damage: 21, range: 143, fireRate: 0.45, slowFactor: 0.3 },
            { damage: 29, range: 157, fireRate: 0.4, slowFactor: 0.2 }
        ]
    }
};

// Tower unlocks by level
export const TOWER_UNLOCKS = {
    basic: 1,
    sniper: 1,
    splash: 1,
    slow: 1
};
