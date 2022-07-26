import { Piece } from './piece.js';
import { Mover } from './mover.js';
export declare class Board {
    tiles: Piece[];
    numToEdge: number[][];
    checkMate: boolean;
    checkIndex: number;
    /**
     * **IMPORTANT**
     *
     * Create `Mover` after creating this
     */
    constructor();
    getFenString(thisMover: Mover): string;
    toString(): string;
}
