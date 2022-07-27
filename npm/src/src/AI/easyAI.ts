import { ChessGame } from '../chessGame.js';
import { randomFromArray } from '../utils.js';
import { BaseAI } from './baseAI.js';
import { getPieceScore } from './utils/utils.js';

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
		const result = { from: -1, to: -1 };
		let highScore = -Infinity;
		let maxOfMin = -Infinity;
		const mover = this.chessGame.mover;
		for (const avIndex of mover.getAllIndexesThatCanMove()) {
			for (const move of this.chessGame.mover.allMoves[avIndex]) {
				const max = getPieceScore(move.to.type);
				if (max < maxOfMin) continue;
				const prevAvMoves = [...this.chessGame.mover.allMoves];
				this.chessGame.mover.moveTest(move);
				this.chessGame.mover.next();
				for (const avIndexEnemy of mover.getAllIndexesThatCanMove()) {
					for (const moveEnemy of this.chessGame.mover.allMoves[avIndexEnemy]) {
						const min = getPieceScore(moveEnemy.to.type);
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

		if (result.from !== -1) return result;
	}
}
