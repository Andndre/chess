import { Board } from './board.ts';
import { Mover } from './mover.ts';

export class ChessGame {
	board: Board;
	mover: Mover;
	gameOver = false;
	fiftyMoveRule: boolean;
	gameOverReason: 'none' | 'checkMate' | 'draw' = 'none';
	private constructor(fen: string, fiftyMoveRuleEnabled = true) {
		this.board = Board.fromFEN(fen);
		this.mover = new Mover(this.board, this);
		this.fiftyMoveRule = fiftyMoveRuleEnabled;
	}

	static newStandardGame() {
		return new ChessGame('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
	}

	static newGameFromFEN(fen: string) {
		return new ChessGame(fen);
	}
}
