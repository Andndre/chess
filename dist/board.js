"use strict";
class Board {
    constructor(chess, canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        let potrait = window.innerHeight > window.innerWidth;
        Board.boxScale = (potrait ? window.innerWidth : window.innerHeight) >> 3;
        this.canvas.height = window.innerHeight;
        this.canvas.width = window.innerWidth;
        this.chess = chess;
        this.ctx.font = Board.boxScale * 0.2 + 'px Arial';
        this.img = document.getElementById('sprite');
    }
    draw() {
        this.drawBackground();
        this.drawAvMovs();
        let selectedIndex = this.chess.selectedIndex;
        if (selectedIndex != undefined) {
            let [x, y] = getCoords(selectedIndex);
            this.ctx.fillStyle = this.chess.currentPlayer == this.chess.firstPlayer ? friendColor : enemyColor;
            this.ctx.fillRect(x * Board.boxScale, y * Board.boxScale, Board.boxScale, Board.boxScale);
        }
        if (this.chess.check != undefined) {
            let [x, y] = getCoords(this.chess.check);
            this.ctx.fillStyle = enemyColor;
            this.ctx.fillRect(x * Board.boxScale, y * Board.boxScale, Board.boxScale, Board.boxScale);
        }
        this.drawPieces();
    }
    drawBackground() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                // draw boxes
                this.ctx.fillStyle = (i + j) % 2 === 0
                    ? lightTileColor
                    : darkTileColor;
                this.ctx.fillRect(j * Board.boxScale, i * Board.boxScale, Board.boxScale, Board.boxScale);
            }
        }
    }
    drawAvMovs() {
        for (let index of this.chess.availableMoves) {
            let [x, y] = getCoords(index);
            if (!this.chess.board[index]) {
                this.ctx.beginPath();
                this.ctx.arc(x * Board.boxScale + (Board.boxScale >> 1), y * Board.boxScale + (Board.boxScale >> 1), Board.boxScale >> 3, 0, Math.PI * 2);
                this.ctx.fillStyle = avMovColor;
                this.ctx.fill();
                continue;
            }
            this.ctx.fillStyle = this.chess.currentPlayer == this.chess.firstPlayer ? enemyColor : friendColor;
            this.ctx.fillRect(x * Board.boxScale, y * Board.boxScale, Board.boxScale, Board.boxScale);
        }
    }
    drawPieces() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let index = getIndex(j, i);
                // highlight selected
                if (this.chess.board[index] == Piece.none)
                    continue;
                this.drawPiece(this.chess.board[index], index);
            }
        }
    }
    drawPiece(piece, index) {
        let black = Piece.isColor(piece, Piece.black);
        // this y-coordinate will be 0 if it is white 
        // and half the height of the sprites if it is black
        let sy = black ? 213 : 0;
        let sx = [
            Piece.king,
            Piece.queen,
            Piece.bishop,
            Piece.knight,
            Piece.rook,
            Piece.pawn
        ].indexOf(Piece.getType(piece)) * 213;
        let [x, y] = getCoords(index);
        this.ctx.drawImage(this.img, sx, sy, 213, 213, x * Board.boxScale, y * Board.boxScale, Board.boxScale, Board.boxScale);
    }
    static getClickedCoord(x, y) {
        x = Math.floor(x / Board.boxScale);
        y = Math.floor(y / Board.boxScale);
        return [x, y];
    }
    static getCLickedIndex(x, y) {
        [x, y] = Board.getClickedCoord(x, y);
        return x + y * 8;
    }
}
Board.boxScale = window.innerHeight >> 3;
