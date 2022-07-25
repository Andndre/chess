import { ChessGame } from '../chessGame.ts';

export interface BaseAI {
	chessGame: ChessGame;
	getMove(): { from: number; to: number } | undefined;
}
