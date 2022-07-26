import { Board } from './board.js';
import { ChessGame } from './chessGame.js';
import { Color, Type } from './piece.js';
import { CellStatus, Move } from './types.js';
declare type CheckIndex = {
    16: number;
    8: number;
};
export declare class Mover {
    board: Board;
    current: Color;
    selectedIndex: number;
    history: Move[];
    enpassantTarget: number;
    checkIndex: CheckIndex;
    /**
     * If white is permitted to castle on the Queen's side
     */
    Q: boolean;
    /**
     * If black is permitted to castle on the Queen's side
     */
    q: boolean;
    /**
     * If white is permitted to castle on the King's side
     */
    K: boolean;
    /**
     * If black is permitted to castle on the King's side,
     */
    k: boolean;
    /**
     * All moves for each tiles
     */
    allMoves: Move[][];
    checkMate: boolean;
    staleMate: boolean;
    chessGame: ChessGame;
    constructor(board: Board, chessGame: ChessGame, fen: string);
    /**
     * Alias for
     * ```ts
     * const lastMove = this.getLastMove();
     * return lastMove.from.type !== this.board.tiles[lastMove.to.index].getType();
     * ```
     */
    isPromote(): boolean;
    /**
     * Alias for
     * ```ts
     * const lastMove = this.getLastMove();
     * const code = type | lastMove.from.color;
     * lastMove.to.type = type;
     * this.board.tiles[lastMove.to.index].code = code;
     * ```
     */
    promoteLastMoveTo(type: Type): void;
    /**
     * Alias for
     * ```ts
     * lastElementInAnArray(this.history);
     * ```
     */
    getLastMove(): Move;
    getAllIndexesThatCanMove(): number[];
    /**
     * If `this.selectedIndex === -1`, it will select a tile ONLY IF
     * the piece in that index was the same color as the `this.current`
     *
     * If `this.selectedIndex !== -1` it will move the piece from
     * `this.selectedIndex` to the input `index` ONLY IF `index`
     * was a valid destination
     */
    selectTile(index: number): void;
    /**
     * alias for generateNextMove
     */
    next(): void;
    /**
     * **if the move is invalid, bad things might happen (or, nothing will happen)**.
     *
     * So make sure that the move was in `this.allMoves`
     *
     * Only indexes are supported
     */
    moveStrict(from: number, to: number): void;
    /**
     * Check if the current king is under attack.
     */
    isCheck(): boolean;
    /**
     * Example of using chess notation:
     * ```ts
     * // Move from `b1` to `d2`
     * moveStrictUsingChessNotation('b1d2')
     * // Pawn promotion
     * moveStrictUsingChessNotation('g7g8=Q')
     * // Castling King's side
     * moveStrictUsingChessNotation('0-0') // or 0-0-0 for queen's side
     * ```
     * If there is no ambiguity,
     * you **cannot** use shorthand notation such as `e4`,
     * or else it might will not work.
     *
     * Like moveStrict(), if the move is invalid, bad things might happen
     */
    moveStrictUsingChessNotation(move: string): void;
    /**
     * Checks if the move was in `this.allMoves`
     */
    isValid(move: Move): boolean;
    /**
     * **DO NOT USE**.
     *
     * Use this function when creating your own AI using `BaseAI` interface just
     * to **test** the move, then undo using `undoMove(true)`.
     * You can see the `getMoveUsingMinMax` example [right here](https://github.com/Andndre/chess/blob/main/src/AI/utils/brain.ts)
     * for generating a move for [this AI](https://github.com/Andndre/chess/blob/main/src/AI/easyAI.ts)
     */
    __move__(move: Move): void;
    /**
     * Restore the board to the state it was in before the last move in the history was made
     *
     * `justAText = false` means do not run onUndo callBack
     */
    undoMove(justATest?: boolean): void;
    /**
     * Fills the legal moves array with the legal moves for the current player
     */
    generateNextMove(): void;
    /**
     * @param {Color} color - The color of the player whose moves are being generated.
     * @returns An array of arrays of moves.
     */
    __generateMoves__(color: Color): {
        moves: Move[][];
        checkMate: boolean;
        staleMate: boolean;
    };
    /**
     * @param {Move} move - Move - The move to check
     * @returns A boolean value.
     */
    __isLegal__(move: Move, kingIndex: number): boolean;
    /**
     * It returns all the legal moves from a given square
     * @param {number} from - the square from which you want to get the legal moves
     * @returns An array of moves that are legal.
     */
    __getLegalMoves__(from: number, kingIndex: number): Move[];
    /**
     * It returns all the legal and non-legal moves for a given piece
     * @param {number} from - the tile number of the piece you want to move
     * @returns An array of moves.
     */
    __getLegalAndIllegalMoves__(from: number): Move[];
    /**
     * Insert to the move list if the move.to s type was included in the insertIf array
     * @param  - move - the move to be inserted
     * @returns - true if the move is in the {insertIf} array
     */
    __insertIf__({ move, moves, insertIf, }: {
        move: Move;
        moves: Move[];
        insertIf?: CellStatus[];
    }): boolean;
    /**
     * Convert fromIndex and toIndex (and optionally capture?: number; move?: Move;) to a Move object
     */
    getMove(fromIndex: number, toIndex: number, options?: {
        capture?: number;
        move?: Move;
    }): Move;
    /**
     * The function returns an array of possible moves for a pawn
     */
    __pawnMove__(from: number): Move[];
    /**
     * Check if the piece on the input `index` is under attack.
     */
    isAttacked(index: number): boolean;
    /**
     * The function returns an array of possible moves for a knight
     */
    __knightMove__(from: number, obj?: this): Move[];
    getKingIndex(color: Color): number;
    /**
     * The function returns an array of possible moves for a king
     */
    __kingMove__(from: number, obj?: this): Move[];
    /**
     * It returns an array of all the moves that a piece can make in a straight line
     */
    __alignAxisMove__(from: number, obj?: this): Move[];
    /**
     * It returns an array of all the moves that a piece can make in a diagonal direction
     */
    __diagonalAxisMove__(from: number, obj?: this): Move[];
    halfMoveClock(): number;
    fullMoveNumber(): number;
    loadFenString(fen: string): void;
}
export {};
