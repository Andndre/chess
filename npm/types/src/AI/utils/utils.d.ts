import { Type } from '../../piece.js';
import { Move } from '../../types.js';
export declare const getPieceScore: (type: Type) => 0 | 10 | 30 | 50 | 90 | 900;
export declare const getMoveScore: (move: Move) => 0 | 10 | 30 | 50 | 90 | 900;
