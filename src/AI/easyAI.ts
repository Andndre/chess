import { ChessGame } from '../chessGame.ts';
import { randomFromArray } from '../utils.ts';
import { BaseAI } from './baseAI.ts';
import { getMoveUsingMinMax } from './utils/brain.ts';

export class EasyAI implements BaseAI {
	chessGame: ChessGame;
	constructor(chessGame: ChessGame) {
		this.chessGame = chessGame;
	}
	getMove() {
		if (this.chessGame.mover.history.length < 5) {
			const mover = this.chessGame.mover;
			const avIndexes = mover.getAllIndexesThatCanMove();
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
