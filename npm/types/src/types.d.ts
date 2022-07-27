import { Color, Type } from './piece.js';
export declare type TileInfo = {
    index: number;
    type: Type;
    color: Color;
};
export declare type CellStatus = 'enemy' | 'none' | 'friend';
export declare type Vector = {
    x: number;
    y: number;
};
export declare type ChessEvent = 'move' | 'undo' | 'capture' | 'whitePromote' | 'blackPromote' | 'castle' | 'gameOver';
export declare type GameOverReason = 'not true' | 'checkMate' | 'draw' | 'staleMate';
export declare type CallBackFunction = () => void;
