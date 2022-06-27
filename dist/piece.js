export var Type;
(function (Type) {
    Type[Type["none"] = 0] = "none";
    Type[Type["king"] = 1] = "king";
    Type[Type["queen"] = 2] = "queen";
    Type[Type["knight"] = 3] = "knight";
    Type[Type["bishop"] = 4] = "bishop";
    Type[Type["pawn"] = 5] = "pawn";
    Type[Type["rook"] = 6] = "rook";
})(Type || (Type = {}));
export var Color;
(function (Color) {
    Color[Color["white"] = 16] = "white";
    Color[Color["black"] = 8] = "black";
    Color[Color["none"] = 0] = "none";
})(Color || (Color = {}));
/*
EXAMPLE:
white king => 16 | 1 = 0b10000 | 0b00001 = 0b10001 = 17
*/
export class Piece {
    constructor(index, code) {
        this.moved = 0;
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
        return piece & 7;
    }
    /**
     * It returns the type of the data.
     * @returns The data property is being returned.
     */
    getType() {
        return this.code & 7;
    }
    /**
     * It returns the color of the piece.
     * @param {number} code - The piece to get the color of.
     * @returns The color of the piece.
     */
    static getColor(code) {
        return code & 24;
    }
    /**
     * It returns the color of the piece.
     * @returns The color of the piece.
     */
    getColor() {
        return this.code & 24;
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
            case "p":
                return Type.pawn;
            case "b":
                return Type.bishop;
            case "k":
                return Type.king;
            case "q":
                return Type.queen;
            case "r":
                return Type.rook;
            case "n":
                return Type.knight;
        }
    }
    /**
     * It returns a string that represents the piece's type and color.
     * Upper case for white pieces and lower case for black pieces.
     * @returns A string representation of the piece.
     */
    getPieceChar() {
        let char = "";
        switch (this.getType()) {
            case Type.bishop:
                char = "b";
                break;
            case Type.king:
                char = "k";
                break;
            case Type.knight:
                char = "n";
                break;
            case Type.pawn:
                char = "p";
                break;
            case Type.queen:
                char = "q";
                break;
            case Type.rook:
                char = "r";
                break;
        }
        if (this.getColor() == Color.white) {
            return char.toUpperCase();
        }
        return char;
    }
}
