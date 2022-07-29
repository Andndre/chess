import { Board } from './board.js';
import { Mover } from './mover.js';
import { CallBackFunction, ChessEvent, GameOverReason } from './types.js';
export declare class ChessGame {
    board: Board;
    mover: Mover;
    gameOver: boolean;
    gameOverReason: GameOverReason;
    onMove: CallBackFunction;
    onUndo: CallBackFunction;
    onCapture: CallBackFunction;
    onWhitePromote: CallBackFunction;
    onBlackPromote: CallBackFunction;
    onCastle: CallBackFunction;
    onGameOver: CallBackFunction;
    private constructor();
    static newStandardGame(): ChessGame;
    /**
     * If you use this, this.checkMate, this.staleMate, this.gameOver,
     * and other states that happen in late game might be wrong.
     */
    static newGameFromFEN(fen: string): ChessGame;
    on(ev: ChessEvent, callBack: CallBackFunction): void;
}
