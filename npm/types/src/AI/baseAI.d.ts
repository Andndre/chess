import { ChessGame } from '../chessGame.js';
export interface BaseAI {
    chessGame: ChessGame;
    getMove(): {
        from: number;
        to: number;
    } | undefined;
}
