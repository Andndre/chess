import { ChessGame } from '../chessGame.js';
import { BaseAI } from './baseAI.js';
/**
 * He moves randomly
 */
export declare class MonkeyAI implements BaseAI {
    chessGame: ChessGame;
    constructor(chessGame: ChessGame);
    getMove(): {
        from: number;
        to: number;
    } | undefined;
}
