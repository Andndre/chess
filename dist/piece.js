"use strict";
class Piece {
    static isColor(piece, color) {
        return Piece.getColor(piece) == color;
    }
    static getType(piece) {
        return piece & 7;
    }
    static getColor(piece) {
        return piece & 24;
    }
    static invertColor(color) {
        return color == 16 ? 8 : 16;
    }
}
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
