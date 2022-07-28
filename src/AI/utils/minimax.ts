import { ChessGame } from '../../chessGame.ts';
import { Color } from '../../piece.ts';
import { getPieceScore } from './utils.ts';

const countMaterial = (chessState: ChessGame) => {
	let white = 0;
	let black = 0;
	for (const tile of chessState.board.tiles) {
		if (tile.getColor() === Color.white) {
			white += getPieceScore(tile.getType());
		} else {
			black += getPieceScore(tile.getType());
		}
	}
	return { white, black };
};

const evaluate = (chessState: ChessGame) => {
	if (chessState.gameOverReason === 'checkMate') return -Infinity;
	if (chessState.gameOver) return 0;
	const { white, black } = countMaterial(chessState);
	return (white - black) * (chessState.mover.current === Color.white ? 1 : -1);
};

// export const maxi = (chessState: ChessGame, depth: number) => {
// 	if (depth === 0) return evaluate(chessState);
// 	if (
// 		chessState.gameOverReason === 'checkMate' ||
// 		chessState.gameOverReason === 'staleMate'
// 	)
// 		return Infinity;
// 	let max = -Infinity;
// 	for (const index of chessState.mover.getAllIndexesThatCanMove()) {
// 		for (const move of chessState.mover.allMoves[index]) {
// 			const prevAllMoves = [...chessState.mover.allMoves];
// 			chessState.mover.moveTest(move);
// 			if (!chessState.gameOver) {
// 				chessState.mover.next();
// 			}
// 			const score = mini(chessState, depth - 1);
// 			chessState.mover.undoMove(true);
// 			chessState.mover.allMoves = prevAllMoves;
// 			max = Math.max(score, max);
// 		}
// 	}
// 	return max;
// };

// export const mini = (chessState: ChessGame, depth: number) => {
// 	if (depth === 0) return -evaluate(chessState);
// 	if (
// 		chessState.gameOverReason === 'checkMate' ||
// 		chessState.gameOverReason === 'staleMate'
// 	)
// 		return -Infinity;
// 	let min = Infinity;
// 	for (const index of chessState.mover.getAllIndexesThatCanMove()) {
// 		for (const move of chessState.mover.allMoves[index]) {
// 			const prevAllMoves = [...chessState.mover.allMoves];
// 			chessState.mover.moveTest(move);
// 			if (!chessState.gameOver) {
// 				chessState.mover.next();
// 			}
// 			const score = maxi(chessState, depth - 1);
// 			chessState.mover.undoMove(true);
// 			chessState.mover.allMoves = prevAllMoves;
// 			min = Math.min(score, min);
// 		}
// 	}
// 	return min;
// };

/**
int alphaBeta( int alpha, int beta, int depthleft ) {
   int bestscore = -oo;
   if( depthleft == 0 ) return quiesce( alpha, beta );
   for ( all moves)  {
      score = -alphaBeta( -beta, -alpha, depthleft - 1 );
      if( score >= beta )
         return score;  // fail-soft beta-cutoff
      if( score > bestscore ) {
         bestscore = score;
         if( score > alpha )
            alpha = score;
      }
   }
   return bestscore;
}

int Quiesce( int alpha, int beta ) {
    int stand_pat = Evaluate();
    if( stand_pat >= beta )
        return beta;
    if( alpha < stand_pat )
        alpha = stand_pat;

    until( every_capture_has_been_examined )  {
        MakeCapture();
        score = -Quiesce( -beta, -alpha );
        TakeBackMove();

        if( score >= beta )
            return beta;
        if( score > alpha )
           alpha = score;
    }
    return alpha;
}
 */

export const minimax = (
	chessState: ChessGame,
	depthLeft: number,
	alpha = -Infinity,
	beta = Infinity
): number => {
	let bestScore = -Infinity;
	if (depthLeft === 0) return evaluate(chessState);
	for (const index of chessState.mover.getAllIndexesThatCanMove()) {
		for (const move of chessState.mover.allMoves[index]) {
			const prevAllMoves = [...chessState.mover.allMoves];
			chessState.mover.moveTest(move);
			if (!chessState.gameOver) {
				chessState.mover.next();
			}
			const score = -minimax(chessState, depthLeft - 1, -beta, -alpha);
			chessState.mover.undoMove(true);
			chessState.mover.allMoves = prevAllMoves;
			if (score >= beta) return score; // fail-soft beta-cutoff
			if (score > bestScore) {
				bestScore = score;
				if (score > alpha) alpha = score;
			}
		}
	}
	return bestScore;
};
