export declare enum Type {
    none = 0,
    king = 1,
    queen = 2,
    knight = 3,
    bishop = 4,
    pawn = 5,
    rook = 6
}
export declare enum Color {
    white = 16,
    black = 8,
    none = 0
}
export declare class Piece {
    index: number;
    /**
     * `Color | Type`
     *
     * example:
     * ```ts
     * Color.white | Type.king // white king
     * ```
     */
    code: number;
    moved: number;
    constructor(index: number, code: number);
    /**
     * "Returns true if the piece is the same color as the color passed in."
     *
     * @param {number} piece - The piece to check.
     * @param {number} color - 16 for white, 8 for black
     * @returns A boolean value.
     */
    static isColor(piece: number, color: Color): boolean;
    /**
     * This function returns true if the piece is the color passed in, otherwise it returns false.
     * @param {Color} color - 16 for white, 8 for black
     * @returns A boolean value.
     */
    isColor(color: Color): boolean;
    static isType(piece: number, type: Type): boolean;
    isType(type: Type): boolean;
    /**
     * It returns the type of the piece.
     * @param piece - The piece to get the type of.
     * @returns The piece type.
     */
    static getType(piece: number): number;
    /**
     * It returns the type of the data.
     * @returns The data property is being returned.
     */
    getType(): number;
    /**
     * It returns the color of the piece.
     * @param {number} code - The piece to get the color of.
     * @returns The color of the piece.
     */
    static getColor(code: number): number;
    /**
     * It returns the color of the piece.
     * @returns The color of the piece.
     */
    getColor(): Color;
    /**
     * If the color is 16 (white), return 8 (black), otherwise return 16 (white).
     * @param {Color} color - The color of the text.
     * @returns The color is being returned.
     */
    static invertColor(color: Color): Color.white | Color.black;
    /**
     * It returns the piece type from the char.
     * @param {string} char - The character that represents the piece type.
     * @returns The type of piece.
     */
    static getTypeFromChar(char: string): Type.king | Type.queen | Type.knight | Type.bishop | Type.pawn | Type.rook | undefined;
    /**
     * It returns a string that represents the piece's type and color.
     * Upper case for white pieces and lower case for black pieces.
     * @returns A string representation of the piece.
     */
    toString(): string;
    static getStringFromCode(): void;
    getChessSymbol(): " " | "♗" | "♝" | "♔" | "♚" | "♘" | "♞" | "♙" | "♟" | "♕" | "♛" | "♖" | "♜";
}
