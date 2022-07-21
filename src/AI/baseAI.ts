import { ChessGame } from '../chessGame.ts';

export class BaseAI {
	chessGame: ChessGame;
	constructor(chessGame: ChessGame) {
		this.chessGame = chessGame;
	}
	getMove(): { from: number; to: number } | undefined {
		return { from: 0, to: 0 };
	}
}
