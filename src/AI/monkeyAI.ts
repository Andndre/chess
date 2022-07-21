import { ChessGame } from '../chessGame.ts';
import { randomFromArray } from '../utils.ts';
import { BaseAI } from './baseAI.ts';
import { getAllIndexesThatCanMove } from './utils/utils.ts';

/**
 * He moves randomly
 */
export class MonkeyAI extends BaseAI {
	constructor(chessGame: ChessGame) {
		super(chessGame);
	}
	getMove() {
		const mover = this.chessGame.mover;
		const avIndexes = getAllIndexesThatCanMove(this.chessGame);
		if (avIndexes) {
			const move = randomFromArray(mover.allMoves[randomFromArray(avIndexes)]);
			return { from: move.from.index, to: move.to.index };
		}
	}
}
