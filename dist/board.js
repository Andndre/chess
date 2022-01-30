"use strict";
class Board {
    constructor() {
        this.colorToMove = Piece.white;
        this.availableMoveIndexes = [];
        this.playAsWhite = true;
        this.selectedIndex = -1;
        this.numToEdge = [];
        this.directionOffsets = [8, -8, -1, 1, 7, -7, 9, -9];
        this.square = [];
        this.rooks = [];
        this.kings = [];
        this.pawns = [];
        this.bishops = [];
        this.queens = [];
        this.knights = [];
        // precompute the distnce from each square to the edge of the board for each direction
        for (let file = 0; file < 8; file++) {
            for (let rank = 0; rank < 8; rank++) {
                let numNorth = 7 - rank;
                let numSouth = rank;
                let numWest = file;
                let numEast = 7 - file;
                let squareIndex = getIndex(file, rank);
                // define the distance to the edge of the board for each direction for each square
                this.numToEdge[squareIndex] = [
                    numNorth,
                    numSouth,
                    numWest,
                    numEast,
                    Math.min(numNorth, numWest),
                    Math.min(numSouth, numEast),
                    Math.min(numNorth, numEast),
                    Math.min(numSouth, numWest),
                ];
            }
        }
    }
    select(index) {
        if (this.selectedIndex != -1) {
            if (this.availableMoveIndexes.indexOf(index) != -1) {
                this.move(new Move(this.selectedIndex, index));
                this.availableMoveIndexes = [];
                this.selectedIndex = -1;
            }
            if (this.square[index].getColor() == this.colorToMove) {
                this.selectedIndex = index;
                this.availableMoveIndexes = Move.generateAvailableMoves(this.selectedIndex);
            }
            return;
        }
        let piece = this.square[index];
        if (piece.getColor() != this.colorToMove)
            return;
        let type = piece.getType();
        if (type == Piece.none)
            return;
        this.selectedIndex = index;
        this.availableMoveIndexes = Move.generateAvailableMoves(this.selectedIndex);
    }
    move(move) {
        if (this.square[move.to].getType() != Piece.none) {
            // capture
            let piece = this.square[move.to];
            // remove the captured piece
            switch (piece.getType()) {
                case Piece.pawn:
                    this.pawns.splice(this.pawns.indexOf(piece), 1);
                    break;
                case Piece.bishop:
                    this.bishops.splice(this.bishops.indexOf(piece), 1);
                    break;
                case Piece.king:
                    this.kings.splice(this.kings.indexOf(piece), 1);
                    break;
                case Piece.queen:
                    this.queens.splice(this.queens.indexOf(piece), 1);
                    break;
                case Piece.knight:
                    this.knights.splice(this.knights.indexOf(piece), 1);
                    break;
                case Piece.rook:
                    this.rooks.splice(this.rooks.indexOf(piece), 1);
                    break;
            }
        }
        // move the piece
        this.square[move.to] = this.square[move.from];
        this.square[move.from] = new Piece(move.from, Piece.none);
        this.square[move.to].index = move.to;
        if (this.square[move.to].getType() == Piece.pawn) {
            let [, y] = getCoords(move.to);
            // if the pawn is at the end of the board, promote it
            if (y == 0 || y == 7) {
                // promote pawn to queen
                // TODO: make this a dropdown menu
                let pawn = this.square[move.to];
                this.pawns.splice(this.pawns.indexOf(pawn), 1);
                this.queens.push(pawn);
                pawn.data = this.colorToMove | Piece.queen;
            }
        }
        // switch player
        this.colorToMove =
            this.colorToMove == Piece.white ? Piece.black : Piece.white;
        this.lastMove = new Move(move.from, move.to);
    }
    // get the board instance or create a new one if it doesn't exist
    static get() {
        if (this.instance == undefined) {
            this.instance = new Board();
        }
        return this.instance;
    }
    // load the board with the given fen position
    // fen : https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation
    loadFenPositions(fen) {
        let index = 0;
        let fenComponents = fen.split(" ");
        let fenPositions = fenComponents[0].split("/");
        this.playAsWhite = fenComponents[1] == "w";
        this.colorToMove = this.playAsWhite ? Piece.white : Piece.black;
        // loop through each row
        for (let row of fenPositions) {
            // loop through each character in the row
            for (let char of row) {
                // if the character is a number, add that many blank squares to the board
                if (["1", "2", "3", "4", "5", "6", "7", "8", "9"].indexOf(char) != -1) {
                    let num = Number.parseInt(char);
                    // fill with none
                    fillTypeRange(this.square, index, index + num, Piece.none);
                    // skip
                    index += num;
                    continue;
                }
                // if the character is a letter, add that piece to the board
                let piece = new Piece(index, Piece.getTypeFromChar(char));
                // add the piece to the board
                this.square[index] = piece;
                let white = isUpperCase(char);
                // set the piece's colour
                this.square[index++].data |= white ? Piece.white : Piece.black;
                // add the piece to the correct piece array
                switch (char.toLowerCase()) {
                    case "p":
                        this.pawns.push(piece);
                        break;
                    case "b":
                        this.bishops.push(piece);
                        break;
                    case "k":
                        this.kings.push(piece);
                        break;
                    case "q":
                        this.queens.push(piece);
                        break;
                    case "r":
                        this.rooks.push(piece);
                        break;
                    case "n":
                        this.knights.push(piece);
                        break;
                }
            }
        }
    }
}
