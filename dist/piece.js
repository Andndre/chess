"use strict";
class Piece {
    constructor(index, data) {
        this.index = index;
        this.data = data;
    }
    static isColor(piece, color) {
        return Piece.getColor(piece) == color;
    }
    isColor(color) {
        return Piece.isColor(this.data, color);
    }
    static getType(piece) {
        return piece & 7;
    }
    getType() {
        return this.data & 7;
    }
    static getColor(piece) {
        return piece & 24;
    }
    getColor() {
        return this.data & 24;
    }
    static invertColor(color) {
        return color == 16 ? 8 : 16;
    }
    static getTypeFromChar(char) {
        switch (char.toLowerCase()) {
            case "p":
                return Piece.pawn;
            case "b":
                return Piece.bishop;
            case "k":
                return Piece.king;
            case "q":
                return Piece.queen;
            case "r":
                return Piece.rook;
            case "n":
                return Piece.knight;
        }
    }
}
// none represents an empty square
Piece.none = 0;
Piece.king = 1;
Piece.queen = 2;
Piece.knight = 3;
Piece.bishop = 4;
Piece.pawn = 5;
Piece.rook = 6;
// for example in binary, 10001. the first two bit represents the colour and the rest represents the type
Piece.white = 16;
Piece.black = 8;
