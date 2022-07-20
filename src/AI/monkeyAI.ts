import { ChessGame } from '../chessGame.ts';
import { randomFromArray } from '../utils.ts';

/**
 * He moves randomly
 */
export class MonkeyAI {
	chessGame: ChessGame;
	constructor(chessGame: ChessGame) {
		this.chessGame = chessGame;
	}
	getMove() {
		const mover = this.chessGame.mover;
		const avIndexes: number[] = [];
		for (const tile of this.chessGame.mover.allMoves) {
			if (!tile.length) continue;
			avIndexes.push(tile[0].from.index);
		}
		if (avIndexes) {
			return randomFromArray(mover.allMoves[randomFromArray(avIndexes)]);
		}
	}
}
