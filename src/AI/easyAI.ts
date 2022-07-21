import { ChessGame } from '../chessGame.ts';
import { randomFromArray } from '../utils.ts';
import { BaseAI } from './baseAI.ts';
import { getMoveUsingMinMax } from './utils/brain.ts';
import { getAllIndexesThatCanMove } from './utils/utils.ts';

export class EasyAI extends BaseAI {
	constructor(chessGame: ChessGame) {
		super(chessGame);
	}
	getMove() {
		if (this.chessGame.mover.history.length < 5) {
			const avIndexes = getAllIndexesThatCanMove(this.chessGame);
			if (avIndexes) {
				const move = randomFromArray(
					this.chessGame.mover.allMoves[randomFromArray(avIndexes)]
				);
				return { from: move.from.index, to: move.to.index };
			}
			return undefined;
		}
		const { result } = getMoveUsingMinMax(this.chessGame);
		if (result.from !== -1) return result;
	}
}
