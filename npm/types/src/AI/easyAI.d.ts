import { ChessGame } from '../chessGame.js';
import { BaseAI } from './baseAI.js';
export declare class EasyAI implements BaseAI {
    chessGame: ChessGame;
    constructor(chessGame: ChessGame);
    getMove(): {
        from: number;
        to: number;
    } | undefined;
}
