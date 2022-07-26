"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonkeyAI = void 0;
const utils_js_1 = require("../utils.js");
/**
 * He moves randomly
 */
class MonkeyAI {
    constructor(chessGame) {
        Object.defineProperty(this, "chessGame", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.chessGame = chessGame;
    }
    getMove() {
        const mover = this.chessGame.mover;
        const avIndexes = mover.getAllIndexesThatCanMove();
        if (avIndexes) {
            const move = (0, utils_js_1.randomFromArray)(mover.allMoves[(0, utils_js_1.randomFromArray)(avIndexes)]);
            return { from: move.from.index, to: move.to.index };
        }
    }
}
exports.MonkeyAI = MonkeyAI;
