"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EasyAI = void 0;
const utils_js_1 = require("../utils.js");
const brain_js_1 = require("./utils/brain.js");
class EasyAI {
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
        if (this.chessGame.mover.history.length < 5) {
            const mover = this.chessGame.mover;
            const avIndexes = mover.getAllIndexesThatCanMove();
            if (avIndexes) {
                const move = (0, utils_js_1.randomFromArray)(this.chessGame.mover.allMoves[(0, utils_js_1.randomFromArray)(avIndexes)]);
                return { from: move.from.index, to: move.to.index };
            }
            return undefined;
        }
        const { result } = (0, brain_js_1.getMoveUsingMinMax)(this.chessGame);
        if (result.from !== -1)
            return result;
    }
}
exports.EasyAI = EasyAI;
