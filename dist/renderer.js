"use strict";
class Renderer {
    constructor() {
        this.sprite = document.getElementById("sprite");
    }
    static get() {
        if (this.instance == undefined) {
            this.instance = new Renderer();
        }
        return this.instance;
    }
    // draw a box with the given color and index
    drawBox(color, index) {
        let [x, y] = getCoords(index);
        ctx.fillStyle = color;
        let boxScale = scaledSize / 8;
        ctx.fillRect(x * boxScale, y * boxScale, boxScale, boxScale);
    }
    drawBoard() {
        let board = Board.get();
        // draw the board
        for (let file = 0; file < 8; file++) {
            for (let rank = 0; rank < 8; rank++) {
                // get the color of the square
                let index = getIndex(file, rank);
                let color = (file + rank) % 2 == 0 ? lightTileColor : darkTileColor;
                // draw the square
                this.drawBox(color, index);
            }
        }
        if (board.checkIndex != undefined) {
            this.drawBox(checkColor, board.checkIndex);
        }
        // draw last move
        if (board.lastMove != undefined) {
            this.drawMove(board.lastMove);
        }
        if (board.selectedIndex != undefined) {
            this.drawBox(moveToColor, board.selectedIndex);
        }
        // draw available moves
        this.drawAvailableMoves();
        // draw the pieces
        this.drawPieces();
    }
    drawMove(move) {
        this.drawBox(moveFromColor, move.from);
        this.drawBox(moveToColor, move.to);
    }
    drawAvailableMoves() {
        let board = Board.get();
        if (board.selectedIndex == -1)
            return;
        let availableMoves = board.availableMoves[board.selectedIndex];
        for (let index of availableMoves) {
            this.drawBox(availableMoveColor, index);
        }
    }
    drawPieces() {
        let board = Board.get();
        let allPieces = board.getAllPieces();
        for (let piece of allPieces) {
            this.drawPiece(piece);
        }
    }
    drawPiece(piece) {
        let black = piece.isColor(Piece.black);
        let singleSpriteSize = this.sprite.width / 6;
        let sy = black ? singleSpriteSize : 0;
        let boxScale = scaledSize / 8;
        let sx = [
            Piece.king,
            Piece.queen,
            Piece.bishop,
            Piece.knight,
            Piece.rook,
            Piece.pawn,
        ].indexOf(piece.getType()) * singleSpriteSize;
        let [x, y] = getCoords(piece.index);
        // draw the piece
        ctx.drawImage(this.sprite, sx, sy, singleSpriteSize, singleSpriteSize, x * boxScale, y * boxScale, boxScale, boxScale);
    }
}
