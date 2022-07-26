"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Piece = exports.Color = exports.Type = void 0;
var Type;
(function (Type) {
    Type[Type["none"] = 0] = "none";
    Type[Type["king"] = 1] = "king";
    Type[Type["queen"] = 2] = "queen";
    Type[Type["knight"] = 3] = "knight";
    Type[Type["bishop"] = 4] = "bishop";
    Type[Type["pawn"] = 5] = "pawn";
    Type[Type["rook"] = 6] = "rook";
})(Type = exports.Type || (exports.Type = {}));
var Color;
(function (Color) {
    Color[Color["white"] = 16] = "white";
    Color[Color["black"] = 8] = "black";
    Color[Color["none"] = 0] = "none";
})(Color = exports.Color || (exports.Color = {}));
/*
EXAMPLE:
white king => 16 | 1 = 0b10000 | 0b00001 = 0b10001 = 17
*/
class Piece {
    constructor(index, code) {
        Object.defineProperty(this, "index", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * `Color | Type`
         *
         * example:
         * ```ts
         * Color.white | Type.king // white king
         * ```
         */
        Object.defineProperty(this, "code", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "moved", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        this.index = index;
        this.code = code;
    }
    /**
     * "Returns true if the piece is the same color as the color passed in."
     *
     * @param {number} piece - The piece to check.
     * @param {number} color - 16 for white, 8 for black
     * @returns A boolean value.
     */
    static isColor(piece, color) {
        // test
        return Piece.getColor(piece) == color;
    }
    /**
     * This function returns true if the piece is the color passed in, otherwise it returns false.
     * @param {Color} color - 16 for white, 8 for black
     * @returns A boolean value.
     */
    isColor(color) {
        return Piece.isColor(this.code, color);
    }
    static isType(piece, type) {
        return Piece.getType(piece) == type;
    }
    isType(type) {
        return Piece.isType(this.code, type);
    }
    /**
     * It returns the type of the piece.
     * @param piece - The piece to get the type of.
     * @returns The piece type.
     */
    static getType(piece) {
        return piece & 0b00111;
    }
    /**
     * It returns the type of the data.
     * @returns The data property is being returned.
     */
    getType() {
        return this.code & 0b00111;
    }
    /**
     * It returns the color of the piece.
     * @param {number} code - The piece to get the color of.
     * @returns The color of the piece.
     */
    static getColor(code) {
        return code & 0b11000;
    }
    /**
     * It returns the color of the piece.
     * @returns The color of the piece.
     */
    getColor() {
        return this.code & 0b11000;
    }
    /**
     * If the color is 16 (white), return 8 (black), otherwise return 16 (white).
     * @param {Color} color - The color of the text.
     * @returns The color is being returned.
     */
    static invertColor(color) {
        return color == Color.white ? Color.black : Color.white;
    }
    /**
     * It returns the piece type from the char.
     * @param {string} char - The character that represents the piece type.
     * @returns The type of piece.
     */
    static getTypeFromChar(char) {
        switch (char.toLowerCase()) {
            case 'p':
                return Type.pawn;
            case 'b':
                return Type.bishop;
            case 'k':
                return Type.king;
            case 'q':
                return Type.queen;
            case 'r':
                return Type.rook;
            case 'n':
                return Type.knight;
        }
    }
    /**
     * It returns a string that represents the piece's type and color.
     * Upper case for white pieces and lower case for black pieces.
     * @returns A string representation of the piece.
     */
    toString() {
        let char = '';
        switch (this.getType()) {
            case Type.bishop:
                char = 'b';
                break;
            case Type.king:
                char = 'k';
                break;
            case Type.knight:
                char = 'n';
                break;
            case Type.pawn:
                char = 'p';
                break;
            case Type.queen:
                char = 'q';
                break;
            case Type.rook:
                char = 'r';
                break;
            default:
                return ' ';
        }
        if (this.getColor() === Color.white) {
            return char.toUpperCase();
        }
        return char;
    }
    getChessSymbol() {
        const white = this.isColor(Color.white);
        switch (this.getType()) {
            case Type.bishop:
                return white ? '♗' : '♝';
            case Type.king:
                return white ? '♔' : '♚';
            case Type.knight:
                return white ? '♘' : '♞';
            case Type.pawn:
                return white ? '♙' : '♟';
            case Type.queen:
                return white ? '♕' : '♛';
            case Type.rook:
                return white ? '♖' : '♜';
            default:
                return ' ';
        }
    }
}
exports.Piece = Piece;
