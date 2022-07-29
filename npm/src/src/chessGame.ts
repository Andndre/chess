import { Board } from './board.js';
import { Mover } from './mover.js';
import { CallBackFunction, ChessEvent, GameOverReason } from './types.js';

export class ChessGame {
	board: Board;
	mover: Mover;
	gameOver = false;
	gameOverReason: GameOverReason = 'not true';
	onMove: CallBackFunction = () => {};
	onUndo: CallBackFunction = () => {};
	onCapture: CallBackFunction = () => {};
	onWhitePromote: CallBackFunction = () => {};
	onBlackPromote: CallBackFunction = () => {};
	onCastle: CallBackFunction = () => {};
	onGameOver: CallBackFunction = () => {};
	private constructor(fen: string) {
		this.board = new Board();
		this.mover = new Mover(this.board, this, fen);
	}

	static newStandardGame() {
		return new ChessGame('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
	}

	/**
	 * If you use this, this.checkMate, this.staleMate, this.gameOver,
	 * and other states that happen in late game might be wrong.
	 */
	static newGameFromFEN(fen: string) {
		return new ChessGame(fen);
	}

	on(ev: ChessEvent, callBack: CallBackFunction) {
		switch (ev) {
			case 'move':
				this.onMove = callBack;
				return;
			case 'capture':
				this.onCapture = callBack;
				return;
			case 'whitePromote':
				this.onWhitePromote = callBack;
				return;
			case 'blackPromote':
				this.onBlackPromote = callBack;
				return;
			case 'undo':
				this.onUndo = callBack;
				return;
			case 'castle':
				this.onCastle = callBack;
				return;
			case 'gameOver':
				this.onGameOver = callBack;
		}
	}
}
