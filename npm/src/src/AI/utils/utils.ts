import { Type } from '../../piece.js';
import { Move } from '../../types.js';

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

export const getMoveScore = (move: Move) => {
	return getPieceScore(move.to.type);
};
