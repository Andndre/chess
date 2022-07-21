import { ChessGame } from '../../chessGame.ts';
import { Type } from '../../piece.ts';
import { Move } from '../../types.ts';

export const getPieceScore = (type: Type) => {
	switch (type) {
		case Type.pawn:
			return 10;
		case Type.knight:
			return 30;
		case Type.bishop:
			return 30;
		case Type.rook:
			return 50;
		case Type.queen:
			return 90;
		case Type.king:
			return 900;
		default:
			return 0;
	}
};

export const getAllIndexesThatCanMove = (chessGame: ChessGame) => {
	const avIndexes: number[] = [];
	for (const tile of chessGame.mover.allMoves) {
		if (!tile.length) continue;
		avIndexes.push(tile[0].from.index);
	}
	return avIndexes;
};

export const getMoveScore = (move: Move) => {
	return getPieceScore(move.to.type);
};