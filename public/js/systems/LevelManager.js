// LevelManager.js - Level loading and management

import { LEVELS } from '../data/levels.js';

export class LevelManager {
    constructor(game) {
        this.game = game;
        this.levels = LEVELS;
    }

    getLevel(levelId) {
        return this.levels.find(level => level.id === levelId);
    }

    getLevelCount() {
        return this.levels.length;
    }

    getAllLevels() {
        return this.levels;
    }

    // Generate level list for level select screen
    getLevelSelectData() {
        const progress = this.game.loadProgress();

        return this.levels.map(level => ({
            id: level.id,
            name: level.name,
            difficulty: level.difficulty,
            unlocked: level.id <= (progress.maxLevel || 1),
            stars: progress.stars[level.id] || 0
        }));
    }
}
