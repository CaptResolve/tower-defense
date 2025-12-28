// levels.js - All 25 level definitions with terrain data

export const LEVELS = [
    // ==================== LEVEL 1 ====================
    {
        id: 1,
        name: "Boot Camp",
        difficulty: 1,
        lives: 20,
        startingGold: 200,
        path: [
            { x: -30, y: 360 },
            { x: 200, y: 360 },
            { x: 200, y: 200 },
            { x: 500, y: 200 },
            { x: 500, y: 500 },
            { x: 900, y: 500 },
            { x: 900, y: 300 },
            { x: 1310, y: 300 }
        ],
        terrain: {
            hills: [
                { x: 350, y: 280, radius: 70 },
                { x: 750, y: 400, radius: 65 }
            ],
            ponds: [
                { x: 100, y: 550, radius: 45 }
            ],
            trees: [
                { x: 80, y: 150, size: 'large' },
                { x: 120, y: 180, size: 'small' },
                { x: 650, y: 150, size: 'medium' },
                { x: 1100, y: 450, size: 'large' },
                { x: 1150, y: 480, size: 'small' },
                { x: 1050, y: 550, size: 'medium' }
            ]
        },
        waves: [
            { groups: [{ type: 'basic', count: 5, delay: 1.0 }] },
            { groups: [{ type: 'basic', count: 8, delay: 0.8 }] },
            { groups: [{ type: 'basic', count: 10, delay: 0.6 }] }
        ],
        scaling: { health: 1, speed: 1, reward: 1 }
    },

    // ==================== LEVEL 2 ====================
    {
        id: 2,
        name: "The Winding Path",
        difficulty: 1,
        lives: 20,
        startingGold: 200,
        path: [
            { x: -30, y: 150 },
            { x: 300, y: 150 },
            { x: 300, y: 400 },
            { x: 600, y: 400 },
            { x: 600, y: 150 },
            { x: 900, y: 150 },
            { x: 900, y: 550 },
            { x: 1310, y: 550 }
        ],
        terrain: {
            hills: [
                { x: 450, y: 280, radius: 75 },
                { x: 750, y: 350, radius: 60 }
            ],
            ponds: [
                { x: 150, y: 550, radius: 50 },
                { x: 1100, y: 200, radius: 40 }
            ],
            trees: [
                { x: 100, y: 280, size: 'large' },
                { x: 140, y: 320, size: 'small' },
                { x: 500, y: 550, size: 'medium' },
                { x: 1000, y: 350, size: 'large' },
                { x: 1050, y: 380, size: 'small' }
            ]
        },
        waves: [
            { groups: [{ type: 'basic', count: 6, delay: 0.9 }] },
            { groups: [{ type: 'basic', count: 10, delay: 0.7 }] },
            { groups: [{ type: 'basic', count: 12, delay: 0.6 }] },
            { groups: [{ type: 'basic', count: 8, delay: 0.5 }, { type: 'fast', count: 3, delay: 0.4 }] }
        ],
        scaling: { health: 1.05, speed: 1, reward: 1 }
    },

    // ==================== LEVEL 3 ====================
    {
        id: 3,
        name: "Speed Demons",
        difficulty: 1,
        lives: 18,
        startingGold: 220,
        path: [
            { x: -30, y: 360 },
            { x: 400, y: 360 },
            { x: 400, y: 150 },
            { x: 800, y: 150 },
            { x: 800, y: 500 },
            { x: 1310, y: 500 }
        ],
        terrain: {
            hills: [
                { x: 250, y: 250, radius: 70 },
                { x: 600, y: 300, radius: 65 },
                { x: 1000, y: 380, radius: 60 }
            ],
            ponds: [
                { x: 150, y: 550, radius: 45 }
            ],
            trees: [
                { x: 100, y: 200, size: 'large' },
                { x: 550, y: 450, size: 'medium' },
                { x: 950, y: 180, size: 'large' },
                { x: 1150, y: 350, size: 'small' },
                { x: 1180, y: 280, size: 'medium' }
            ]
        },
        waves: [
            { groups: [{ type: 'basic', count: 8, delay: 0.8 }] },
            { groups: [{ type: 'fast', count: 8, delay: 0.5 }] },
            { groups: [{ type: 'basic', count: 5, delay: 0.6 }, { type: 'fast', count: 8, delay: 0.4 }] },
            { groups: [{ type: 'fast', count: 15, delay: 0.35 }] }
        ],
        scaling: { health: 1.1, speed: 1.02, reward: 1.05 }
    },

    // ==================== LEVEL 4 ====================
    {
        id: 4,
        name: "The Corridor",
        difficulty: 1,
        lives: 18,
        startingGold: 230,
        path: [
            { x: -30, y: 360 },
            { x: 1310, y: 360 }
        ],
        terrain: {
            hills: [
                { x: 320, y: 250, radius: 70 },
                { x: 640, y: 470, radius: 75 },
                { x: 960, y: 250, radius: 70 }
            ],
            ponds: [
                { x: 200, y: 550, radius: 50 },
                { x: 1100, y: 550, radius: 45 }
            ],
            trees: [
                { x: 100, y: 180, size: 'large' },
                { x: 140, y: 220, size: 'small' },
                { x: 500, y: 180, size: 'medium' },
                { x: 780, y: 550, size: 'large' },
                { x: 1150, y: 180, size: 'medium' }
            ]
        },
        waves: [
            { groups: [{ type: 'basic', count: 12, delay: 0.7 }] },
            { groups: [{ type: 'fast', count: 10, delay: 0.4 }] },
            { groups: [{ type: 'basic', count: 8, delay: 0.5 }, { type: 'fast', count: 6, delay: 0.35 }] },
            { groups: [{ type: 'tank', count: 2, delay: 2.0 }] },
            { groups: [{ type: 'basic', count: 15, delay: 0.4 }] }
        ],
        scaling: { health: 1.15, speed: 1.03, reward: 1.08 }
    },

    // ==================== LEVEL 5 ====================
    {
        id: 5,
        name: "Introducing Tanks",
        difficulty: 2,
        lives: 15,
        startingGold: 250,
        path: [
            { x: -30, y: 200 },
            { x: 300, y: 200 },
            { x: 300, y: 500 },
            { x: 700, y: 500 },
            { x: 700, y: 200 },
            { x: 1000, y: 200 },
            { x: 1000, y: 400 },
            { x: 1310, y: 400 }
        ],
        terrain: {
            hills: [
                { x: 150, y: 350, radius: 65 },
                { x: 500, y: 350, radius: 70 },
                { x: 850, y: 350, radius: 65 }
            ],
            ponds: [
                { x: 550, y: 150, radius: 50 }
            ],
            trees: [
                { x: 100, y: 450, size: 'large' },
                { x: 900, y: 550, size: 'medium' },
                { x: 1150, y: 250, size: 'large' },
                { x: 1180, y: 550, size: 'small' }
            ]
        },
        waves: [
            { groups: [{ type: 'basic', count: 10, delay: 0.6 }] },
            { groups: [{ type: 'tank', count: 3, delay: 1.5 }] },
            { groups: [{ type: 'basic', count: 8, delay: 0.5 }, { type: 'tank', count: 2, delay: 1.5 }] },
            { groups: [{ type: 'fast', count: 12, delay: 0.35 }] },
            { groups: [{ type: 'tank', count: 5, delay: 1.2 }] }
        ],
        scaling: { health: 1.2, speed: 1.05, reward: 1.1 }
    },

    // ==================== LEVEL 6 ====================
    {
        id: 6,
        name: "Mixed Assault",
        difficulty: 2,
        lives: 15,
        startingGold: 260,
        path: [
            { x: -30, y: 100 },
            { x: 200, y: 100 },
            { x: 200, y: 400 },
            { x: 500, y: 400 },
            { x: 500, y: 100 },
            { x: 800, y: 100 },
            { x: 800, y: 550 },
            { x: 1100, y: 550 },
            { x: 1100, y: 300 },
            { x: 1310, y: 300 }
        ],
        terrain: {
            hills: [
                { x: 350, y: 250, radius: 70 },
                { x: 650, y: 350, radius: 65 },
                { x: 950, y: 400, radius: 60 }
            ],
            ponds: [
                { x: 100, y: 550, radius: 45 },
                { x: 700, y: 450, radius: 40 }
            ],
            trees: [
                { x: 350, y: 550, size: 'large' },
                { x: 600, y: 550, size: 'medium' },
                { x: 1000, y: 180, size: 'large' },
                { x: 1200, y: 450, size: 'small' }
            ]
        },
        waves: [
            { groups: [{ type: 'basic', count: 12, delay: 0.55 }] },
            { groups: [{ type: 'fast', count: 10, delay: 0.35 }, { type: 'tank', count: 2, delay: 1.5 }] },
            { groups: [{ type: 'tank', count: 4, delay: 1.2 }] },
            { groups: [{ type: 'basic', count: 15, delay: 0.4 }, { type: 'fast', count: 8, delay: 0.3 }] },
            { groups: [{ type: 'tank', count: 3, delay: 1.0 }, { type: 'fast', count: 15, delay: 0.25 }] }
        ],
        scaling: { health: 1.25, speed: 1.05, reward: 1.12 }
    },

    // ==================== LEVEL 7 ====================
    {
        id: 7,
        name: "Spiral Path",
        difficulty: 2,
        lives: 15,
        startingGold: 280,
        path: [
            { x: -30, y: 360 },
            { x: 150, y: 360 },
            { x: 150, y: 150 },
            { x: 500, y: 150 },
            { x: 500, y: 500 },
            { x: 800, y: 500 },
            { x: 800, y: 250 },
            { x: 1050, y: 250 },
            { x: 1050, y: 450 },
            { x: 1310, y: 450 }
        ],
        terrain: {
            hills: [
                { x: 320, y: 320, radius: 75 },
                { x: 650, y: 350, radius: 65 },
                { x: 930, y: 380, radius: 60 }
            ],
            ponds: [
                { x: 250, y: 550, radius: 50 },
                { x: 1150, y: 180, radius: 40 }
            ],
            trees: [
                { x: 80, y: 200, size: 'large' },
                { x: 400, y: 400, size: 'medium' },
                { x: 700, y: 180, size: 'large' },
                { x: 1100, y: 580, size: 'small' },
                { x: 1180, y: 350, size: 'medium' }
            ]
        },
        waves: [
            { groups: [{ type: 'basic', count: 15, delay: 0.5 }] },
            { groups: [{ type: 'fast', count: 12, delay: 0.3 }] },
            { groups: [{ type: 'basic', count: 10, delay: 0.45 }, { type: 'tank', count: 3, delay: 1.2 }] },
            { groups: [{ type: 'fast', count: 20, delay: 0.25 }] },
            { groups: [{ type: 'tank', count: 5, delay: 1.0 }, { type: 'basic', count: 10, delay: 0.4 }] },
            { groups: [{ type: 'fast', count: 15, delay: 0.2 }, { type: 'tank', count: 4, delay: 0.8 }] }
        ],
        scaling: { health: 1.3, speed: 1.07, reward: 1.15 }
    },

    // ==================== LEVEL 8 ====================
    {
        id: 8,
        name: "Double Trouble",
        difficulty: 2,
        lives: 12,
        startingGold: 300,
        path: [
            { x: -30, y: 200 },
            { x: 400, y: 200 },
            { x: 640, y: 360 },
            { x: 900, y: 360 },
            { x: 1310, y: 360 }
        ],
        terrain: {
            hills: [
                { x: 200, y: 350, radius: 70 },
                { x: 500, y: 280, radius: 65 },
                { x: 800, y: 480, radius: 60 }
            ],
            ponds: [
                { x: 300, y: 550, radius: 55 },
                { x: 1000, y: 180, radius: 45 }
            ],
            trees: [
                { x: 100, y: 450, size: 'large' },
                { x: 600, y: 550, size: 'medium' },
                { x: 1100, y: 500, size: 'large' },
                { x: 1180, y: 250, size: 'small' }
            ]
        },
        waves: [
            { groups: [{ type: 'basic', count: 15, delay: 0.45 }] },
            { groups: [{ type: 'fast', count: 18, delay: 0.28 }] },
            { groups: [{ type: 'tank', count: 6, delay: 0.9 }] },
            { groups: [{ type: 'basic', count: 12, delay: 0.35 }, { type: 'fast', count: 12, delay: 0.25 }] },
            { groups: [{ type: 'tank', count: 4, delay: 0.8 }, { type: 'fast', count: 20, delay: 0.2 }] },
            { groups: [{ type: 'basic', count: 20, delay: 0.3 }, { type: 'tank', count: 5, delay: 0.7 }] }
        ],
        scaling: { health: 1.35, speed: 1.08, reward: 1.18 }
    },

    // ==================== LEVEL 9 ====================
    {
        id: 9,
        name: "Final Preparation",
        difficulty: 2,
        lives: 12,
        startingGold: 320,
        path: [
            { x: 640, y: -30 },
            { x: 640, y: 200 },
            { x: 200, y: 200 },
            { x: 200, y: 500 },
            { x: 1080, y: 500 },
            { x: 1080, y: 200 },
            { x: 640, y: 200 },
            { x: 640, y: 750 }
        ],
        terrain: {
            hills: [
                { x: 420, y: 350, radius: 75 },
                { x: 860, y: 350, radius: 70 }
            ],
            ponds: [
                { x: 150, y: 350, radius: 50 },
                { x: 1150, y: 400, radius: 45 }
            ],
            trees: [
                { x: 350, y: 550, size: 'large' },
                { x: 750, y: 380, size: 'medium' },
                { x: 550, y: 580, size: 'small' },
                { x: 950, y: 580, size: 'large' }
            ]
        },
        waves: [
            { groups: [{ type: 'basic', count: 18, delay: 0.4 }] },
            { groups: [{ type: 'fast', count: 20, delay: 0.25 }] },
            { groups: [{ type: 'tank', count: 8, delay: 0.8 }] },
            { groups: [{ type: 'basic', count: 15, delay: 0.3 }, { type: 'fast', count: 15, delay: 0.2 }] },
            { groups: [{ type: 'tank', count: 6, delay: 0.6 }, { type: 'fast', count: 25, delay: 0.18 }] },
            { groups: [{ type: 'basic', count: 25, delay: 0.25 }, { type: 'tank', count: 8, delay: 0.5 }] },
            { groups: [{ type: 'tank', count: 10, delay: 0.4 }] }
        ],
        scaling: { health: 1.4, speed: 1.1, reward: 1.2 }
    },

    // ==================== LEVEL 10 - FIRST BOSS ====================
    {
        id: 10,
        name: "The Guardian",
        difficulty: 3,
        lives: 10,
        startingGold: 400,
        path: [
            { x: -30, y: 360 },
            { x: 300, y: 360 },
            { x: 300, y: 150 },
            { x: 600, y: 150 },
            { x: 600, y: 550 },
            { x: 980, y: 550 },
            { x: 980, y: 360 },
            { x: 1310, y: 360 }
        ],
        terrain: {
            hills: [
                { x: 450, y: 350, radius: 80 },
                { x: 780, y: 400, radius: 70 },
                { x: 150, y: 250, radius: 60 }
            ],
            ponds: [
                { x: 800, y: 180, radius: 55 },
                { x: 200, y: 550, radius: 45 }
            ],
            trees: [
                { x: 100, y: 180, size: 'large' },
                { x: 500, y: 400, size: 'medium' },
                { x: 1100, y: 180, size: 'large' },
                { x: 1150, y: 500, size: 'small' },
                { x: 700, y: 300, size: 'medium' }
            ]
        },
        waves: [
            { groups: [{ type: 'basic', count: 20, delay: 0.35 }] },
            { groups: [{ type: 'fast', count: 25, delay: 0.2 }] },
            { groups: [{ type: 'tank', count: 8, delay: 0.6 }] },
            { groups: [{ type: 'basic', count: 15, delay: 0.25 }, { type: 'tank', count: 5, delay: 0.5 }] },
            { groups: [{ type: 'fast', count: 30, delay: 0.15 }] },
            { groups: [{ type: 'boss', count: 1, delay: 0 }] }
        ],
        scaling: { health: 1.5, speed: 1.1, reward: 1.25 }
    },

    // ==================== LEVELS 11-15 ====================
    {
        id: 11,
        name: "After the Storm",
        difficulty: 3,
        lives: 12,
        startingGold: 350,
        path: [
            { x: -30, y: 500 },
            { x: 250, y: 500 },
            { x: 250, y: 200 },
            { x: 550, y: 200 },
            { x: 550, y: 500 },
            { x: 850, y: 500 },
            { x: 850, y: 200 },
            { x: 1150, y: 200 },
            { x: 1150, y: 400 },
            { x: 1310, y: 400 }
        ],
        terrain: {
            hills: [
                { x: 400, y: 350, radius: 75 },
                { x: 700, y: 350, radius: 70 },
                { x: 1000, y: 350, radius: 65 }
            ],
            ponds: [
                { x: 100, y: 300, radius: 50 },
                { x: 680, y: 580, radius: 45 }
            ],
            trees: [
                { x: 150, y: 180, size: 'large' },
                { x: 450, y: 580, size: 'medium' },
                { x: 950, y: 580, size: 'large' },
                { x: 1200, y: 550, size: 'small' }
            ]
        },
        waves: [
            { groups: [{ type: 'basic', count: 22, delay: 0.35 }] },
            { groups: [{ type: 'fast', count: 25, delay: 0.22 }] },
            { groups: [{ type: 'tank', count: 8, delay: 0.7 }] },
            { groups: [{ type: 'basic', count: 18, delay: 0.28 }, { type: 'fast', count: 15, delay: 0.18 }] },
            { groups: [{ type: 'tank', count: 10, delay: 0.55 }] },
            { groups: [{ type: 'fast', count: 35, delay: 0.15 }, { type: 'tank', count: 5, delay: 0.5 }] }
        ],
        scaling: { health: 1.55, speed: 1.12, reward: 1.28 }
    },

    {
        id: 12,
        name: "The Gauntlet Begins",
        difficulty: 3,
        lives: 10,
        startingGold: 380,
        path: [
            { x: -30, y: 360 },
            { x: 1310, y: 360 }
        ],
        terrain: {
            hills: [
                { x: 250, y: 250, radius: 70 },
                { x: 500, y: 470, radius: 75 },
                { x: 800, y: 250, radius: 70 },
                { x: 1050, y: 470, radius: 65 }
            ],
            ponds: [
                { x: 150, y: 550, radius: 55 },
                { x: 640, y: 180, radius: 50 },
                { x: 1150, y: 180, radius: 45 }
            ],
            trees: [
                { x: 100, y: 180, size: 'large' },
                { x: 400, y: 180, size: 'medium' },
                { x: 950, y: 550, size: 'large' },
                { x: 1200, y: 550, size: 'small' }
            ]
        },
        waves: [
            { groups: [{ type: 'basic', count: 25, delay: 0.3 }] },
            { groups: [{ type: 'fast', count: 30, delay: 0.18 }] },
            { groups: [{ type: 'tank', count: 12, delay: 0.5 }] },
            { groups: [{ type: 'basic', count: 20, delay: 0.22 }, { type: 'tank', count: 8, delay: 0.4 }] },
            { groups: [{ type: 'fast', count: 40, delay: 0.12 }] },
            { groups: [{ type: 'tank', count: 15, delay: 0.35 }] },
            { groups: [{ type: 'basic', count: 30, delay: 0.18 }, { type: 'fast', count: 25, delay: 0.12 }] }
        ],
        scaling: { health: 1.6, speed: 1.14, reward: 1.3 }
    },

    {
        id: 13,
        name: "Zigzag",
        difficulty: 3,
        lives: 10,
        startingGold: 400,
        path: [
            { x: -30, y: 100 },
            { x: 300, y: 100 },
            { x: 300, y: 600 },
            { x: 600, y: 600 },
            { x: 600, y: 100 },
            { x: 900, y: 100 },
            { x: 900, y: 600 },
            { x: 1200, y: 600 },
            { x: 1200, y: 350 },
            { x: 1310, y: 350 }
        ],
        terrain: {
            hills: [
                { x: 150, y: 350, radius: 70 },
                { x: 450, y: 350, radius: 75 },
                { x: 750, y: 350, radius: 70 },
                { x: 1050, y: 400, radius: 65 }
            ],
            ponds: [
                { x: 200, y: 550, radius: 45 },
                { x: 1100, y: 180, radius: 50 }
            ],
            trees: [
                { x: 100, y: 200, size: 'large' },
                { x: 500, y: 350, size: 'medium' },
                { x: 800, y: 450, size: 'large' },
                { x: 1150, y: 480, size: 'small' }
            ]
        },
        waves: [
            { groups: [{ type: 'fast', count: 35, delay: 0.15 }] },
            { groups: [{ type: 'basic', count: 28, delay: 0.25 }] },
            { groups: [{ type: 'tank', count: 12, delay: 0.5 }] },
            { groups: [{ type: 'fast', count: 25, delay: 0.12 }, { type: 'basic', count: 20, delay: 0.2 }] },
            { groups: [{ type: 'tank', count: 15, delay: 0.4 }] },
            { groups: [{ type: 'fast', count: 45, delay: 0.1 }] },
            { groups: [{ type: 'basic', count: 35, delay: 0.15 }, { type: 'tank', count: 10, delay: 0.35 }] }
        ],
        scaling: { health: 1.65, speed: 1.15, reward: 1.32 }
    },

    {
        id: 14,
        name: "The Arena",
        difficulty: 3,
        lives: 8,
        startingGold: 420,
        path: [
            { x: -30, y: 360 },
            { x: 200, y: 360 },
            { x: 400, y: 200 },
            { x: 640, y: 200 },
            { x: 640, y: 500 },
            { x: 880, y: 500 },
            { x: 1080, y: 360 },
            { x: 1310, y: 360 }
        ],
        terrain: {
            hills: [
                { x: 300, y: 480, radius: 70 },
                { x: 520, y: 350, radius: 75 },
                { x: 760, y: 350, radius: 70 },
                { x: 980, y: 200, radius: 65 }
            ],
            ponds: [
                { x: 150, y: 200, radius: 50 },
                { x: 1150, y: 550, radius: 45 }
            ],
            trees: [
                { x: 100, y: 500, size: 'large' },
                { x: 450, y: 550, size: 'medium' },
                { x: 850, y: 180, size: 'large' },
                { x: 1200, y: 200, size: 'small' }
            ]
        },
        waves: [
            { groups: [{ type: 'basic', count: 30, delay: 0.22 }] },
            { groups: [{ type: 'fast', count: 40, delay: 0.12 }] },
            { groups: [{ type: 'tank', count: 15, delay: 0.4 }] },
            { groups: [{ type: 'basic', count: 25, delay: 0.18 }, { type: 'fast', count: 30, delay: 0.1 }] },
            { groups: [{ type: 'tank', count: 18, delay: 0.35 }] },
            { groups: [{ type: 'fast', count: 50, delay: 0.08 }] },
            { groups: [{ type: 'basic', count: 40, delay: 0.12 }, { type: 'tank', count: 12, delay: 0.3 }] },
            { groups: [{ type: 'tank', count: 20, delay: 0.25 }] }
        ],
        scaling: { health: 1.7, speed: 1.16, reward: 1.35 }
    },

    {
        id: 15,
        name: "Crossroads",
        difficulty: 3,
        lives: 8,
        startingGold: 450,
        path: [
            { x: -30, y: 200 },
            { x: 400, y: 200 },
            { x: 640, y: 360 },
            { x: 880, y: 200 },
            { x: 1310, y: 200 }
        ],
        terrain: {
            hills: [
                { x: 200, y: 350, radius: 70 },
                { x: 640, y: 500, radius: 80 },
                { x: 1080, y: 350, radius: 70 }
            ],
            ponds: [
                { x: 400, y: 500, radius: 55 },
                { x: 880, y: 500, radius: 50 }
            ],
            trees: [
                { x: 100, y: 450, size: 'large' },
                { x: 550, y: 180, size: 'medium' },
                { x: 730, y: 180, size: 'medium' },
                { x: 1200, y: 450, size: 'large' }
            ]
        },
        waves: [
            { groups: [{ type: 'basic', count: 35, delay: 0.2 }] },
            { groups: [{ type: 'fast', count: 45, delay: 0.1 }] },
            { groups: [{ type: 'tank', count: 18, delay: 0.35 }] },
            { groups: [{ type: 'basic', count: 30, delay: 0.15 }, { type: 'fast', count: 35, delay: 0.08 }] },
            { groups: [{ type: 'tank', count: 20, delay: 0.3 }] },
            { groups: [{ type: 'fast', count: 55, delay: 0.07 }] },
            { groups: [{ type: 'basic', count: 45, delay: 0.1 }, { type: 'tank', count: 15, delay: 0.25 }] },
            { groups: [{ type: 'tank', count: 25, delay: 0.22 }] }
        ],
        scaling: { health: 1.75, speed: 1.18, reward: 1.38 }
    },

    // ==================== LEVELS 16-20 ====================
    {
        id: 16,
        name: "Reinforcements",
        difficulty: 4,
        lives: 8,
        startingGold: 480,
        path: [
            { x: -30, y: 360 },
            { x: 300, y: 360 },
            { x: 300, y: 150 },
            { x: 700, y: 150 },
            { x: 700, y: 550 },
            { x: 1100, y: 550 },
            { x: 1100, y: 300 },
            { x: 1310, y: 300 }
        ],
        terrain: {
            hills: [
                { x: 150, y: 250, radius: 65 },
                { x: 500, y: 350, radius: 80 },
                { x: 900, y: 400, radius: 75 }
            ],
            ponds: [
                { x: 450, y: 550, radius: 55 },
                { x: 950, y: 180, radius: 50 }
            ],
            trees: [
                { x: 100, y: 500, size: 'large' },
                { x: 600, y: 400, size: 'medium' },
                { x: 800, y: 180, size: 'large' },
                { x: 1200, y: 450, size: 'small' }
            ]
        },
        waves: [
            { groups: [{ type: 'basic', count: 40, delay: 0.18 }] },
            { groups: [{ type: 'fast', count: 50, delay: 0.09 }] },
            { groups: [{ type: 'tank', count: 22, delay: 0.3 }] },
            { groups: [{ type: 'basic', count: 35, delay: 0.12 }, { type: 'fast', count: 40, delay: 0.07 }] },
            { groups: [{ type: 'tank', count: 25, delay: 0.25 }] },
            { groups: [{ type: 'fast', count: 60, delay: 0.06 }] },
            { groups: [{ type: 'basic', count: 50, delay: 0.09 }, { type: 'tank', count: 18, delay: 0.2 }] },
            { groups: [{ type: 'tank', count: 30, delay: 0.18 }] }
        ],
        scaling: { health: 1.8, speed: 1.2, reward: 1.4 }
    },

    {
        id: 17,
        name: "Marathon",
        difficulty: 4,
        lives: 6,
        startingGold: 500,
        path: [
            { x: -30, y: 100 },
            { x: 200, y: 100 },
            { x: 200, y: 620 },
            { x: 400, y: 620 },
            { x: 400, y: 100 },
            { x: 600, y: 100 },
            { x: 600, y: 620 },
            { x: 800, y: 620 },
            { x: 800, y: 100 },
            { x: 1000, y: 100 },
            { x: 1000, y: 620 },
            { x: 1200, y: 620 },
            { x: 1200, y: 360 },
            { x: 1310, y: 360 }
        ],
        terrain: {
            hills: [
                { x: 300, y: 360, radius: 65 },
                { x: 500, y: 360, radius: 65 },
                { x: 700, y: 360, radius: 65 },
                { x: 900, y: 360, radius: 65 },
                { x: 1100, y: 450, radius: 60 }
            ],
            ponds: [
                { x: 100, y: 360, radius: 45 },
                { x: 1150, y: 180, radius: 40 }
            ],
            trees: [
                { x: 150, y: 200, size: 'medium' },
                { x: 550, y: 200, size: 'medium' },
                { x: 950, y: 200, size: 'medium' }
            ]
        },
        waves: [
            { groups: [{ type: 'basic', count: 45, delay: 0.15 }] },
            { groups: [{ type: 'fast', count: 55, delay: 0.08 }] },
            { groups: [{ type: 'tank', count: 25, delay: 0.28 }] },
            { groups: [{ type: 'basic', count: 40, delay: 0.1 }, { type: 'fast', count: 45, delay: 0.06 }] },
            { groups: [{ type: 'tank', count: 28, delay: 0.22 }] },
            { groups: [{ type: 'fast', count: 70, delay: 0.05 }] },
            { groups: [{ type: 'basic', count: 55, delay: 0.08 }, { type: 'tank', count: 20, delay: 0.18 }] },
            { groups: [{ type: 'tank', count: 35, delay: 0.15 }] },
            { groups: [{ type: 'fast', count: 80, delay: 0.04 }, { type: 'tank', count: 15, delay: 0.12 }] }
        ],
        scaling: { health: 1.85, speed: 1.22, reward: 1.42 }
    },

    {
        id: 18,
        name: "The Crucible",
        difficulty: 4,
        lives: 6,
        startingGold: 520,
        path: [
            { x: 640, y: -30 },
            { x: 640, y: 360 },
            { x: 200, y: 360 },
            { x: 200, y: 600 },
            { x: 1080, y: 600 },
            { x: 1080, y: 360 },
            { x: 640, y: 360 },
            { x: 640, y: 750 }
        ],
        terrain: {
            hills: [
                { x: 420, y: 480, radius: 75 },
                { x: 860, y: 480, radius: 75 },
                { x: 640, y: 200, radius: 65 }
            ],
            ponds: [
                { x: 150, y: 200, radius: 55 },
                { x: 1130, y: 200, radius: 50 }
            ],
            trees: [
                { x: 350, y: 200, size: 'large' },
                { x: 930, y: 200, size: 'large' },
                { x: 450, y: 360, size: 'medium' },
                { x: 830, y: 360, size: 'medium' }
            ]
        },
        waves: [
            { groups: [{ type: 'basic', count: 50, delay: 0.12 }] },
            { groups: [{ type: 'fast', count: 60, delay: 0.07 }] },
            { groups: [{ type: 'tank', count: 28, delay: 0.25 }] },
            { groups: [{ type: 'basic', count: 45, delay: 0.09 }, { type: 'fast', count: 50, delay: 0.05 }] },
            { groups: [{ type: 'tank', count: 32, delay: 0.2 }] },
            { groups: [{ type: 'fast', count: 75, delay: 0.045 }] },
            { groups: [{ type: 'basic', count: 60, delay: 0.07 }, { type: 'tank', count: 22, delay: 0.15 }] },
            { groups: [{ type: 'tank', count: 40, delay: 0.12 }] },
            { groups: [{ type: 'fast', count: 90, delay: 0.035 }, { type: 'tank', count: 18, delay: 0.1 }] }
        ],
        scaling: { health: 1.9, speed: 1.24, reward: 1.45 }
    },

    {
        id: 19,
        name: "No Mercy",
        difficulty: 4,
        lives: 5,
        startingGold: 550,
        path: [
            { x: -30, y: 360 },
            { x: 250, y: 360 },
            { x: 250, y: 150 },
            { x: 500, y: 150 },
            { x: 500, y: 550 },
            { x: 780, y: 550 },
            { x: 780, y: 150 },
            { x: 1030, y: 150 },
            { x: 1030, y: 550 },
            { x: 1310, y: 550 }
        ],
        terrain: {
            hills: [
                { x: 375, y: 350, radius: 70 },
                { x: 640, y: 350, radius: 75 },
                { x: 905, y: 350, radius: 70 }
            ],
            ponds: [
                { x: 150, y: 200, radius: 50 },
                { x: 1150, y: 350, radius: 50 }
            ],
            trees: [
                { x: 100, y: 500, size: 'large' },
                { x: 620, y: 180, size: 'medium' },
                { x: 1200, y: 200, size: 'large' }
            ]
        },
        waves: [
            { groups: [{ type: 'basic', count: 55, delay: 0.1 }] },
            { groups: [{ type: 'fast', count: 70, delay: 0.06 }] },
            { groups: [{ type: 'tank', count: 32, delay: 0.22 }] },
            { groups: [{ type: 'basic', count: 50, delay: 0.08 }, { type: 'fast', count: 55, delay: 0.045 }] },
            { groups: [{ type: 'tank', count: 38, delay: 0.18 }] },
            { groups: [{ type: 'fast', count: 85, delay: 0.04 }] },
            { groups: [{ type: 'basic', count: 65, delay: 0.06 }, { type: 'tank', count: 25, delay: 0.12 }] },
            { groups: [{ type: 'tank', count: 45, delay: 0.1 }] },
            { groups: [{ type: 'fast', count: 100, delay: 0.03 }, { type: 'tank', count: 20, delay: 0.08 }] },
            { groups: [{ type: 'basic', count: 80, delay: 0.05 }, { type: 'tank', count: 30, delay: 0.08 }] }
        ],
        scaling: { health: 1.95, speed: 1.26, reward: 1.48 }
    },

    // ==================== LEVEL 20 - SECOND BOSS ====================
    {
        id: 20,
        name: "The Warlord",
        difficulty: 5,
        lives: 5,
        startingGold: 600,
        path: [
            { x: -30, y: 360 },
            { x: 300, y: 360 },
            { x: 300, y: 120 },
            { x: 640, y: 120 },
            { x: 640, y: 600 },
            { x: 980, y: 600 },
            { x: 980, y: 120 },
            { x: 1310, y: 120 }
        ],
        terrain: {
            hills: [
                { x: 150, y: 250, radius: 65 },
                { x: 470, y: 360, radius: 80 },
                { x: 810, y: 360, radius: 80 },
                { x: 1150, y: 250, radius: 65 }
            ],
            ponds: [
                { x: 480, y: 550, radius: 55 },
                { x: 800, y: 200, radius: 50 }
            ],
            trees: [
                { x: 100, y: 500, size: 'large' },
                { x: 560, y: 300, size: 'medium' },
                { x: 720, y: 450, size: 'medium' },
                { x: 1100, y: 450, size: 'large' }
            ]
        },
        waves: [
            { groups: [{ type: 'basic', count: 60, delay: 0.09 }] },
            { groups: [{ type: 'fast', count: 75, delay: 0.05 }] },
            { groups: [{ type: 'tank', count: 35, delay: 0.2 }] },
            { groups: [{ type: 'basic', count: 55, delay: 0.07 }, { type: 'fast', count: 60, delay: 0.04 }] },
            { groups: [{ type: 'tank', count: 40, delay: 0.15 }] },
            { groups: [{ type: 'fast', count: 90, delay: 0.035 }] },
            { groups: [{ type: 'basic', count: 70, delay: 0.05 }, { type: 'tank', count: 28, delay: 0.1 }] },
            { groups: [{ type: 'boss', count: 1, delay: 0 }, { type: 'tank', count: 15, delay: 0.5 }] }
        ],
        scaling: { health: 2.0, speed: 1.28, reward: 1.5 }
    },

    // ==================== LEVELS 21-24 ====================
    {
        id: 21,
        name: "Endless Tide",
        difficulty: 5,
        lives: 5,
        startingGold: 580,
        path: [
            { x: -30, y: 200 },
            { x: 400, y: 200 },
            { x: 400, y: 520 },
            { x: 880, y: 520 },
            { x: 880, y: 200 },
            { x: 1310, y: 200 }
        ],
        terrain: {
            hills: [
                { x: 200, y: 360, radius: 75 },
                { x: 640, y: 360, radius: 85 },
                { x: 1080, y: 360, radius: 75 }
            ],
            ponds: [
                { x: 550, y: 180, radius: 55 },
                { x: 750, y: 180, radius: 50 }
            ],
            trees: [
                { x: 100, y: 400, size: 'large' },
                { x: 500, y: 400, size: 'medium' },
                { x: 780, y: 400, size: 'medium' },
                { x: 1000, y: 550, size: 'large' }
            ]
        },
        waves: [
            { groups: [{ type: 'basic', count: 70, delay: 0.08 }] },
            { groups: [{ type: 'fast', count: 85, delay: 0.045 }] },
            { groups: [{ type: 'tank', count: 40, delay: 0.18 }] },
            { groups: [{ type: 'basic', count: 60, delay: 0.06 }, { type: 'fast', count: 70, delay: 0.035 }] },
            { groups: [{ type: 'tank', count: 45, delay: 0.14 }] },
            { groups: [{ type: 'fast', count: 100, delay: 0.03 }] },
            { groups: [{ type: 'basic', count: 80, delay: 0.045 }, { type: 'tank', count: 32, delay: 0.09 }] },
            { groups: [{ type: 'tank', count: 50, delay: 0.08 }] },
            { groups: [{ type: 'fast', count: 110, delay: 0.025 }, { type: 'tank', count: 25, delay: 0.07 }] },
            { groups: [{ type: 'basic', count: 90, delay: 0.04 }, { type: 'tank', count: 35, delay: 0.06 }] }
        ],
        scaling: { health: 2.1, speed: 1.3, reward: 1.52 }
    },

    {
        id: 22,
        name: "Death Valley",
        difficulty: 5,
        lives: 4,
        startingGold: 600,
        path: [
            { x: -30, y: 360 },
            { x: 200, y: 360 },
            { x: 200, y: 100 },
            { x: 500, y: 100 },
            { x: 500, y: 620 },
            { x: 800, y: 620 },
            { x: 800, y: 100 },
            { x: 1100, y: 100 },
            { x: 1100, y: 360 },
            { x: 1310, y: 360 }
        ],
        terrain: {
            hills: [
                { x: 350, y: 360, radius: 75 },
                { x: 650, y: 360, radius: 80 },
                { x: 950, y: 360, radius: 75 }
            ],
            ponds: [
                { x: 150, y: 550, radius: 55 },
                { x: 1200, y: 550, radius: 50 }
            ],
            trees: [
                { x: 100, y: 200, size: 'large' },
                { x: 600, y: 200, size: 'medium' },
                { x: 900, y: 500, size: 'large' },
                { x: 1180, y: 200, size: 'medium' }
            ]
        },
        waves: [
            { groups: [{ type: 'basic', count: 75, delay: 0.07 }] },
            { groups: [{ type: 'fast', count: 95, delay: 0.04 }] },
            { groups: [{ type: 'tank', count: 45, delay: 0.16 }] },
            { groups: [{ type: 'basic', count: 65, delay: 0.055 }, { type: 'fast', count: 80, delay: 0.03 }] },
            { groups: [{ type: 'tank', count: 50, delay: 0.12 }] },
            { groups: [{ type: 'fast', count: 110, delay: 0.025 }] },
            { groups: [{ type: 'basic', count: 85, delay: 0.04 }, { type: 'tank', count: 38, delay: 0.08 }] },
            { groups: [{ type: 'tank', count: 55, delay: 0.07 }] },
            { groups: [{ type: 'fast', count: 120, delay: 0.022 }, { type: 'tank', count: 30, delay: 0.06 }] },
            { groups: [{ type: 'basic', count: 100, delay: 0.035 }, { type: 'tank', count: 40, delay: 0.055 }] }
        ],
        scaling: { health: 2.2, speed: 1.32, reward: 1.55 }
    },

    {
        id: 23,
        name: "Apocalypse",
        difficulty: 5,
        lives: 4,
        startingGold: 620,
        path: [
            { x: 640, y: -30 },
            { x: 640, y: 200 },
            { x: 200, y: 200 },
            { x: 200, y: 520 },
            { x: 1080, y: 520 },
            { x: 1080, y: 200 },
            { x: 640, y: 200 },
            { x: 640, y: 750 }
        ],
        terrain: {
            hills: [
                { x: 420, y: 360, radius: 80 },
                { x: 860, y: 360, radius: 80 },
                { x: 640, y: 400, radius: 70 }
            ],
            ponds: [
                { x: 350, y: 580, radius: 55 },
                { x: 930, y: 580, radius: 55 }
            ],
            trees: [
                { x: 100, y: 350, size: 'large' },
                { x: 540, y: 320, size: 'medium' },
                { x: 740, y: 320, size: 'medium' },
                { x: 1180, y: 350, size: 'large' }
            ]
        },
        waves: [
            { groups: [{ type: 'basic', count: 80, delay: 0.065 }] },
            { groups: [{ type: 'fast', count: 100, delay: 0.035 }] },
            { groups: [{ type: 'tank', count: 50, delay: 0.14 }] },
            { groups: [{ type: 'basic', count: 70, delay: 0.05 }, { type: 'fast', count: 85, delay: 0.028 }] },
            { groups: [{ type: 'tank', count: 55, delay: 0.11 }] },
            { groups: [{ type: 'fast', count: 120, delay: 0.022 }] },
            { groups: [{ type: 'basic', count: 90, delay: 0.035 }, { type: 'tank', count: 42, delay: 0.07 }] },
            { groups: [{ type: 'tank', count: 60, delay: 0.06 }] },
            { groups: [{ type: 'fast', count: 130, delay: 0.02 }, { type: 'tank', count: 35, delay: 0.055 }] },
            { groups: [{ type: 'basic', count: 110, delay: 0.03 }, { type: 'tank', count: 45, delay: 0.05 }] },
            { groups: [{ type: 'boss', count: 1, delay: 0 }] }
        ],
        scaling: { health: 2.3, speed: 1.34, reward: 1.58 }
    },

    {
        id: 24,
        name: "Last Stand",
        difficulty: 5,
        lives: 3,
        startingGold: 650,
        path: [
            { x: -30, y: 360 },
            { x: 250, y: 360 },
            { x: 250, y: 120 },
            { x: 530, y: 120 },
            { x: 530, y: 600 },
            { x: 750, y: 600 },
            { x: 750, y: 120 },
            { x: 1030, y: 120 },
            { x: 1030, y: 600 },
            { x: 1310, y: 600 }
        ],
        terrain: {
            hills: [
                { x: 390, y: 360, radius: 75 },
                { x: 640, y: 360, radius: 80 },
                { x: 890, y: 360, radius: 75 }
            ],
            ponds: [
                { x: 150, y: 200, radius: 50 },
                { x: 1180, y: 360, radius: 55 }
            ],
            trees: [
                { x: 100, y: 500, size: 'large' },
                { x: 450, y: 500, size: 'medium' },
                { x: 830, y: 500, size: 'medium' },
                { x: 1150, y: 200, size: 'large' }
            ]
        },
        waves: [
            { groups: [{ type: 'basic', count: 90, delay: 0.06 }] },
            { groups: [{ type: 'fast', count: 110, delay: 0.032 }] },
            { groups: [{ type: 'tank', count: 55, delay: 0.12 }] },
            { groups: [{ type: 'basic', count: 80, delay: 0.045 }, { type: 'fast', count: 95, delay: 0.025 }] },
            { groups: [{ type: 'tank', count: 60, delay: 0.1 }] },
            { groups: [{ type: 'fast', count: 130, delay: 0.02 }] },
            { groups: [{ type: 'basic', count: 100, delay: 0.032 }, { type: 'tank', count: 48, delay: 0.065 }] },
            { groups: [{ type: 'tank', count: 65, delay: 0.055 }] },
            { groups: [{ type: 'fast', count: 140, delay: 0.018 }, { type: 'tank', count: 40, delay: 0.05 }] },
            { groups: [{ type: 'basic', count: 120, delay: 0.028 }, { type: 'tank', count: 50, delay: 0.045 }] },
            { groups: [{ type: 'boss', count: 1, delay: 0 }, { type: 'tank', count: 25, delay: 0.3 }] }
        ],
        scaling: { health: 2.4, speed: 1.36, reward: 1.6 }
    },

    // ==================== LEVEL 25 - FINAL BOSS ====================
    {
        id: 25,
        name: "The Final Stand",
        difficulty: 5,
        lives: 3,
        startingGold: 700,
        path: [
            { x: -30, y: 360 },
            { x: 200, y: 360 },
            { x: 200, y: 100 },
            { x: 500, y: 100 },
            { x: 500, y: 620 },
            { x: 800, y: 620 },
            { x: 800, y: 100 },
            { x: 1100, y: 100 },
            { x: 1100, y: 360 },
            { x: 1310, y: 360 }
        ],
        terrain: {
            hills: [
                { x: 350, y: 360, radius: 80 },
                { x: 650, y: 360, radius: 90 },
                { x: 950, y: 360, radius: 80 }
            ],
            ponds: [
                { x: 150, y: 550, radius: 60 },
                { x: 1200, y: 550, radius: 55 }
            ],
            trees: [
                { x: 100, y: 200, size: 'large' },
                { x: 300, y: 500, size: 'medium' },
                { x: 600, y: 200, size: 'large' },
                { x: 900, y: 500, size: 'medium' },
                { x: 1180, y: 200, size: 'large' }
            ]
        },
        waves: [
            { groups: [{ type: 'basic', count: 100, delay: 0.055 }] },
            { groups: [{ type: 'fast', count: 120, delay: 0.028 }] },
            { groups: [{ type: 'tank', count: 60, delay: 0.1 }] },
            { groups: [{ type: 'basic', count: 90, delay: 0.04 }, { type: 'fast', count: 100, delay: 0.022 }] },
            { groups: [{ type: 'tank', count: 70, delay: 0.085 }] },
            { groups: [{ type: 'fast', count: 150, delay: 0.016 }] },
            { groups: [{ type: 'basic', count: 110, delay: 0.028 }, { type: 'tank', count: 55, delay: 0.055 }] },
            { groups: [{ type: 'tank', count: 80, delay: 0.045 }] },
            { groups: [{ type: 'fast', count: 160, delay: 0.014 }, { type: 'tank', count: 50, delay: 0.04 }] },
            { groups: [{ type: 'basic', count: 130, delay: 0.024 }, { type: 'tank', count: 60, delay: 0.038 }] },
            { groups: [{ type: 'boss', count: 1, delay: 0 }, { type: 'tank', count: 40, delay: 0.2 }, { type: 'fast', count: 50, delay: 0.08 }] },
            { groups: [{ type: 'boss', count: 2, delay: 3.0 }] }
        ],
        scaling: { health: 2.5, speed: 1.4, reward: 1.65 }
    }
];
