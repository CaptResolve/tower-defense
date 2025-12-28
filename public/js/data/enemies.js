// enemies.js - Enemy configuration data

export const ENEMY_CONFIG = {
    basic: {
        name: 'Grunt',
        health: 100,
        speed: 80,
        reward: 10,
        damage: 1,
        radius: 15,
        color: '#ff6b6b',
        secondaryColor: '#c92a2a',
        description: 'Standard enemy unit.'
    },
    fast: {
        name: 'Runner',
        health: 50,
        speed: 150,
        reward: 15,
        damage: 1,
        radius: 12,
        color: '#ffd43b',
        secondaryColor: '#fab005',
        description: 'Fast but fragile.'
    },
    tank: {
        name: 'Bruiser',
        health: 400,
        speed: 40,
        reward: 30,
        damage: 2,
        radius: 22,
        color: '#495057',
        secondaryColor: '#343a40',
        description: 'Heavily armored, slow moving.'
    },
    boss: {
        name: 'Overlord',
        health: 2000,
        speed: 30,
        reward: 200,
        damage: 5,
        radius: 35,
        color: '#862e9c',
        secondaryColor: '#5f3dc4',
        description: 'Powerful boss enemy with multiple phases.',
        phases: [
            { healthPercent: 1.0, speedMult: 1.0 },
            { healthPercent: 0.5, speedMult: 1.5 },
            { healthPercent: 0.25, speedMult: 2.0 }
        ]
    }
};

// Wave composition templates for procedural generation
export const WAVE_TEMPLATES = {
    early: [
        { type: 'basic', weight: 0.8 },
        { type: 'fast', weight: 0.2 }
    ],
    mid: [
        { type: 'basic', weight: 0.5 },
        { type: 'fast', weight: 0.3 },
        { type: 'tank', weight: 0.2 }
    ],
    late: [
        { type: 'basic', weight: 0.3 },
        { type: 'fast', weight: 0.35 },
        { type: 'tank', weight: 0.35 }
    ],
    boss: [
        { type: 'boss', weight: 1.0 }
    ]
};
