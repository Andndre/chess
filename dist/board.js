import { Color, Piece, Type } from "./piece.js";
import { isUpperCase, log } from "./utils.js";
import { getIndex } from "./coordinates.js";
import { NONE } from "./constants.js";
export class Board {
    constructor(fen) {
        this.tiles = [];
        this.numToEdge = [];
        this.checkMate = false;
        this.attackedIndexes = [];
        this.checkIndex = NONE;
        log(1, "precomputing the distance from each square to the edge of the board for each direction");
        // precompute the distance from each square to the edge of the board for each direction
        for (let file = 0; file < 8; file++) {
            for (let rank = 0; rank < 8; rank++) {
                let up = 7 - rank;
                let down = rank;
                let left = file;
                let right = 7 - file;
                let squareIndex = getIndex(file, rank);
                // define the distance to the edge of the board for each direction for each square
                this.numToEdge[squareIndex] = [
                    up,
                    down,
                    left,
                    right,
                    Math.min(up, left),
                    Math.min(down, right),
                    Math.min(up, right),
                    Math.min(down, left),
                ];
            }
        }
        this.loadFenString(fen);
        log(-1, "");
    }
    loadFenString(fen) {
        log(1, "loading fen string ", fen);
        let index = 0;
        let fenComponents = fen.split(" ");
        let fenPositions = fenComponents[0].split("/");
        // loop through each row
        for (let row of fenPositions) {
            // loop through each character in the row
            for (let char of row) {
                // if the character is a number, add that many blank squares to the board
                if (char.match(/[0-9]/)) {
                    let num = Number.parseInt(char);
                    // fill with none
                    for (let i = index; i <= index + num; i++) {
                        this.tiles[i] = new Piece(i, Type.none);
                    }
                    // skip
                    index += num;
                    continue;
                }
                // if the character is a letter, add that piece to the board
                let piece = new Piece(index, Piece.getTypeFromChar(char));
                // add the piece to the board
                this.tiles[index] = piece;
                let white = isUpperCase(char);
                // set the piece's colour
                this.tiles[index].code |= white ? Color.white : Color.black;
                index++;
            }
        }
        log(-1, "");
    }
}
