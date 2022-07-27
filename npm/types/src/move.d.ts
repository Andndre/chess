import { Board } from '../mod.js';
import { Type } from './piece.js';
import { TileInfo } from './types.js';
export declare class Move {
    from: TileInfo;
    to: TileInfo;
    capture?: TileInfo;
    promoteTo?: Type;
    move?: Move;
    check?: number;
    constructor(board: Board, fromIndex: number, toIndex: number, captureIndex?: number, promoteTo?: Type, move?: {
        fromIndex: number;
        toIndex: number;
    }, checkIndex?: number);
}
