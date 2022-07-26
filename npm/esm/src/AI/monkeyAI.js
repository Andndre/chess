import { randomFromArray } from '../utils.js';
/**
 * He moves randomly
 */
export class MonkeyAI {
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
            const move = randomFromArray(mover.allMoves[randomFromArray(avIndexes)]);
            return { from: move.from.index, to: move.to.index };
        }
    }
}
