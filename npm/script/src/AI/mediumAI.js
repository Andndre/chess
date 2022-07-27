"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediumAI = void 0;
const minimax_js_1 = require("./utils/minimax.js");
class MediumAI {
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
        const result = { from: -1, to: -1 };
        let maxScore = -Infinity;
        for (const index of this.chessGame.mover.getAllIndexesThatCanMove()) {
            for (const move of this.chessGame.mover.allMoves[index]) {
                const prevAllMoves = [...this.chessGame.mover.allMoves];
                this.chessGame.mover.moveTest(move);
                this.chessGame.mover.next();
                const current = (0, minimax_js_1.minimax)(this.chessGame, 3, 0, 0, true);
                this.chessGame.mover.undoMove(true);
                this.chessGame.mover.allMoves = prevAllMoves;
                if (current > maxScore) {
                    maxScore = current;
                    result.from = move.from.index;
                    result.to = move.to.index;
                }
            }
        }
        if (result.from !== -1) {
            return result;
        }
    }
}
exports.MediumAI = MediumAI;
