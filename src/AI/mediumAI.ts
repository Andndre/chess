import { ChessGame } from '../chessGame.ts';
import { BaseAI } from './baseAI.ts';
import { minimax } from './utils/minimax.ts';

export class MediumAI implements BaseAI {
	chessGame: ChessGame;
	constructor(chessGame: ChessGame) {
		this.chessGame = chessGame;
	}
	getMove() {
		const result = { from: -1, to: -1 };
		let maxScore = -Infinity;
		for (const index of this.chessGame.mover.getAllIndexesThatCanMove()) {
			for (const move of this.chessGame.mover.allMoves[index]) {
				const prevAllMoves = [...this.chessGame.mover.allMoves];
				this.chessGame.mover.moveTest(move);
				let current = 0;
				if (!this.chessGame.gameOver) {
					this.chessGame.mover.next();
					current = minimax(this.chessGame, 2);
				}
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
