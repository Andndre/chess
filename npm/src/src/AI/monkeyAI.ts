import { ChessGame } from '../chessGame.js';
import { randomFromArray } from '../utils.js';
import { BaseAI } from './baseAI.js';

/**
 * He moves randomly
 */
export class MonkeyAI implements BaseAI {
	chessGame: ChessGame;
	constructor(chessGame: ChessGame) {
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
