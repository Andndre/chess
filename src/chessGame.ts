import { Board } from './board.ts';
import { Mover } from './mover.ts';

export class ChessGame {
	board: Board;
	mover: Mover;
	private constructor(fen: string) {
		this.board = Board.fromFEN(fen);
		this.mover = new Mover(this.board);
	}

	static newStandardGame() {
		return new ChessGame('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
	}

	static newGameFromFEN(fen: string) {
		return new ChessGame(fen);
	}
}
