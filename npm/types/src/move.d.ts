import { Board } from '../mod.js';
import { TileInfo } from './types.js';
export declare class Move {
    from: TileInfo;
    to: TileInfo;
    capture?: TileInfo;
    move?: Move;
    check?: number;
    constructor(board: Board, fromIndex: number, toIndex: number, captureIndex?: number, move?: {
        fromIndex: number;
        toIndex: number;
    }, checkIndex?: number);
    isPromote(): boolean;
}
