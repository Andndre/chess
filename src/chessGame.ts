import { Board } from './board.ts';
import { Mover } from './mover.ts';
import { CallBackFunction, ChessEvent, GameOverReason } from './types.ts';

export class ChessGame {
	board: Board;
	mover: Mover;
	gameOver = false;
	fiftyMoveRule: boolean;
	gameOverReason: GameOverReason = 'not true';
	onMove: CallBackFunction[] = [];
	onUndo: CallBackFunction[] = [];
	onCapture: CallBackFunction[] = [];
	onPromote: CallBackFunction[] = [];
	onCastle: CallBackFunction[] = [];
	onGameOver: CallBackFunction[] = [];
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
				this.onMove.push(callBack);
				return;
			case 'capture':
				this.onCapture.push(callBack);
				return;
			case 'promote':
				this.onPromote.push(callBack);
				return;
			case 'undo':
				this.onUndo.push(callBack);
				return;
			case 'castle':
				this.onCastle.push(callBack);
				return;
			case 'gameOver':
				this.onGameOver.push(callBack);
		}
	}
}
