"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EasyAI = void 0;
const utils_js_1 = require("../utils.js");
const utils_js_2 = require("./utils/utils.js");
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
        const result = { from: -1, to: -1 };
        let highScore = -Infinity;
        let maxOfMin = -Infinity;
        const mover = this.chessGame.mover;
        for (const avIndex of mover.getAllIndexesThatCanMove()) {
            for (const move of this.chessGame.mover.allMoves[avIndex]) {
                const max = (0, utils_js_2.getPieceScore)(move.to.type);
                if (max < maxOfMin)
                    continue;
                const prevAvMoves = [...this.chessGame.mover.allMoves];
                this.chessGame.mover.moveTest(move);
                this.chessGame.mover.next();
                for (const avIndexEnemy of mover.getAllIndexesThatCanMove()) {
                    for (const moveEnemy of this.chessGame.mover.allMoves[avIndexEnemy]) {
                        const min = (0, utils_js_2.getPieceScore)(moveEnemy.to.type);
                        if (min > maxOfMin) {
                            maxOfMin = min;
                        }
                        const current = max - min;
                        if (current > highScore) {
                            highScore = current;
                            result.from = move.from.index;
                            result.to = move.to.index;
                        }
                    }
                }
                this.chessGame.mover.undoMove(true);
                this.chessGame.mover.allMoves = prevAvMoves;
            }
        }
        if (result.from !== -1)
            return result;
    }
}
exports.EasyAI = EasyAI;
