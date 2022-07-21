import { Board } from './board.ts';
import { Mover } from './mover.ts';
import { CallBackFunction, ChessEvent, GameOverReason } from './types.ts';

export class ChessGame {
	board: Board;
	mover: Mover;
	gameOver = false;
	fiftyMoveRule: boolean;
	gameOverReason: GameOverReason = 'not true';
	onMove: CallBackFunction = () => {};
	onUndo: CallBackFunction = () => {};
	onCapture: CallBackFunction = () => {};
	onWhitePromote: CallBackFunction = () => {};
	onBlackPromote: CallBackFunction = () => {};
	onCastle: CallBackFunction = () => {};
	onGameOver: CallBackFunction = () => {};
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
