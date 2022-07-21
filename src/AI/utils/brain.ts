import { ChessGame } from '../../chessGame.ts';
import { getAllIndexesThatCanMove, getMoveScore } from './utils.ts';

export const getMoveUsingMinMax = (chessGame: ChessGame) => {
	const result = { from: -1, to: -1 };
	let highScore = -Infinity;
	let maxOfMin = -Infinity;
	for (const avIndex of getAllIndexesThatCanMove(chessGame)) {
		for (const move of chessGame.mover.allMoves[avIndex]) {
			const max = getMoveScore(move);
			if (max < maxOfMin) continue;
			const prevAvMoves = [...chessGame.mover.allMoves];
			chessGame.mover.__move__(move, true);
			chessGame.mover.generateNextMove();
			for (const avIndexEnemy of getAllIndexesThatCanMove(chessGame)) {
				for (const moveEnemy of chessGame.mover.allMoves[avIndexEnemy]) {
					const min = getMoveScore(moveEnemy);
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
			chessGame.mover.undoMove(true);
			chessGame.mover.allMoves = prevAvMoves;
		}
	}

	return { result, highScore };
};
