import { ChessGame } from '../chessGame.js';
import { BaseAI } from './baseAI.js';
export declare class MediumAI implements BaseAI {
    chessGame: ChessGame;
    constructor(chessGame: ChessGame);
    getMove(): {
        from: number;
        to: number;
    } | undefined;
}
