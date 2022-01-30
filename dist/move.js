"use strict";
class Move {
    constructor(from, to) {
        this.from = from;
        this.to = to;
    }
    static insertAvMove({ move, moves, insertIf = ["enemy", "none"], }) {
        let board = Board.get();
        let piece = board.square[move.from];
        let pieceTo = board.square[move.to];
        let color = piece.getColor();
        let colorTo = pieceTo.getColor();
        if (Piece.invertColor(color) == colorTo) {
            if (insertIf.indexOf("enemy") != -1) {
                moves.push(move.to);
                return true;
            }
            return false;
        }
        if (colorTo == Piece.none) {
            if (insertIf.indexOf("none") != -1) {
                moves.push(move.to);
                return true;
            }
            return false;
        }
        if (insertIf.indexOf("friend") != -1) {
            moves.push(move.to);
            return true;
        }
        return false;
    }
    static generateAvailableMoves(from) {
        let board = Board.get();
        let result = [];
        let [x, y] = getCoords(from);
        let piece = board.square[from];
        // RNBQKBNR
        // ROOKS //
        if (piece.getType() === Piece.rook) {
            result.push(...Move.alignAxisMove(from));
        }
        // KNIGHTS //
        else if (piece.getType() == Piece.knight) {
            let range = [
                [-2, 2],
                [-1, 1],
            ];
            for (let i = 0; i < 2; i++) {
                for (let xOffset of range[i]) {
                    for (let yOffset of range[1 - i]) {
                        if (x + xOffset < 0 ||
                            x + xOffset > 7 ||
                            y + yOffset < 0 ||
                            y + yOffset > 7)
                            continue;
                        let index = getIndex(x + xOffset, y + yOffset);
                        this.insertAvMove({ move: new Move(from, index), moves: result });
                    }
                }
            }
        }
        // BISHOPS //
        else if (piece.getType() == Piece.bishop) {
            result.push(...Move.diagonalAxisMove(from));
        }
        // QUEEN //
        else if (piece.getType() == Piece.queen) {
            result.push(...Move.alignAxisMove(from));
            result.push(...Move.diagonalAxisMove(from));
        }
        // KING //
        else if (piece.getType() == Piece.king) {
            let range = [
                [-1, 1],
                [-1, 0],
                [-1, -1],
                [0, -1],
                [1, -1],
                [1, 0],
                [1, 1],
                [0, 1],
            ];
            let coord = getCoords(from);
            for (let i = 0; i < 8; i++) {
                let xOffset = range[i][0];
                let yOffset = range[i][1];
                let xFinal = coord[0] + xOffset;
                let yFinal = coord[1] + yOffset;
                if (xFinal < 0 || xFinal > 7 || yFinal < 0 || yFinal > 7)
                    continue;
                let index = getIndex(xFinal, yFinal);
                this.insertAvMove({ move: new Move(from, index), moves: result });
            }
        }
        // PAWNS //
        else if (piece.getType() == Piece.pawn) {
            let board = Board.get();
            let offset = piece.getColor() == (board.playAsWhite ? Piece.white : Piece.black)
                ? -8
                : 8;
            let index = from + offset;
            [, y] = getCoords(from);
            if (this.insertAvMove({
                move: new Move(from, index),
                moves: result,
                insertIf: ["none"],
            })) {
                if (y == (offset == 8 ? 1 : 6)) {
                    this.insertAvMove({
                        move: new Move(from, index + offset),
                        moves: result,
                        insertIf: ["none"],
                    });
                }
            }
            if (index % 8 != 0) {
                this.insertAvMove({
                    move: new Move(from, index - 1),
                    moves: result,
                    insertIf: ["enemy"],
                });
            }
            if ((index - 7) % 8 != 0) {
                this.insertAvMove({
                    move: new Move(from, index + 1),
                    moves: result,
                    insertIf: ["enemy"],
                });
            }
        }
        return result;
    }
    static alignAxisMove(from) {
        let board = Board.get();
        let piece = board.square[from];
        let colorToMove = piece.getColor();
        let moves = [];
        for (let i = 0; i < 4; i++) {
            let current = from;
            let dirrection = board.directionOffsets[i];
            for (let j = 0; j < board.numToEdge[from][i]; j++) {
                current += dirrection;
                let color = board.square[current].getColor();
                if (color == Piece.none || color == Piece.invertColor(colorToMove)) {
                    moves.push(current);
                }
                if (color == colorToMove || color == Piece.invertColor(colorToMove)) {
                    break;
                }
            }
        }
        return moves;
    }
    static diagonalAxisMove(from) {
        let board = Board.get();
        let piece = board.square[from];
        let colorToMove = piece.getColor();
        let moves = [];
        for (let i = 4; i < 9; i++) {
            let current = from;
            let dirrection = board.directionOffsets[i];
            for (let j = 0; j < board.numToEdge[from][i]; j++) {
                current += dirrection;
                let color = board.square[current].getColor();
                if (color == Piece.none || color == Piece.invertColor(colorToMove)) {
                    moves.push(current);
                }
                if (color == colorToMove || color == Piece.invertColor(colorToMove)) {
                    break;
                }
            }
        }
        return moves;
    }
}
