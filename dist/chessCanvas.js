"use strict";
class ChessCanvas {
    constructor(chess, canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.canvas.height = window.innerHeight;
        this.canvas.width = window.innerWidth;
        this.chess = chess;
        this.ctx.font = ChessCanvas.boxScale * 0.2 + 'px Arial';
        this.img = document.getElementById('sprite');
    }
    draw() {
        this.drawBackground();
        this.drawAvMovs();
        let selectedIndex = this.chess.selectedIndex;
        if (selectedIndex != undefined) {
            let selectedCoord = ChessCanvas.getCoords(selectedIndex);
            this.ctx.fillStyle = this.chess.currentPlayer == this.chess.firstPlayer ? highlight : enemy;
            this.ctx.fillRect(selectedCoord.x * ChessCanvas.boxScale, selectedCoord.y * ChessCanvas.boxScale, ChessCanvas.boxScale, ChessCanvas.boxScale);
        }
        this.drawPieces();
    }
    drawBackground() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                // draw boxes
                this.ctx.fillStyle = (i + j) % 2 === 0
                    ? light
                    : dark;
                this.ctx.fillRect(j * ChessCanvas.boxScale, i * ChessCanvas.boxScale, ChessCanvas.boxScale, ChessCanvas.boxScale);
                // draw coordinates (a-h and 1-8)
                if (i === 7) {
                    this.ctx.fillStyle = j % 2 === 0 ? light : dark;
                    this.ctx.fillText(String.fromCharCode(97 + j), j * ChessCanvas.boxScale + ChessCanvas.boxScale * 0.8, i * ChessCanvas.boxScale + ChessCanvas.boxScale * 0.95);
                }
                if (j === 0) {
                    this.ctx.fillStyle = i % 2 === 0 ? dark : light;
                    this.ctx.fillText(String.fromCharCode(49 + (7 - i)), ChessCanvas.boxScale * 0.05, i * ChessCanvas.boxScale + ChessCanvas.boxScale * 0.2);
                }
            }
        }
    }
    drawAvMovs() {
        for (let index of this.chess.availableMoves) {
            let coord = ChessCanvas.getCoords(index);
            if (!this.chess.board[index]) {
                this.ctx.beginPath();
                this.ctx.arc(coord.x * ChessCanvas.boxScale + (ChessCanvas.boxScale >> 1), coord.y * ChessCanvas.boxScale + (ChessCanvas.boxScale >> 1), ChessCanvas.boxScale >> 3, 0, Math.PI * 2);
                this.ctx.fillStyle = avMovColor;
                this.ctx.fill();
                continue;
            }
            this.ctx.fillStyle = this.chess.currentPlayer == this.chess.firstPlayer ? enemy : highlight;
            this.ctx.fillRect(coord.x * ChessCanvas.boxScale, coord.y * ChessCanvas.boxScale, ChessCanvas.boxScale, ChessCanvas.boxScale);
        }
    }
    drawPieces() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let index = ChessCanvas.getIndex({ x: j, y: i });
                // highlight selected
                if (!this.chess.board[index])
                    continue;
                this.drawPiece(this.chess.board[index], index);
            }
        }
    }
    drawPiece(name, index) {
        let black = name == name.toLowerCase();
        // this y-coordinate will be 0 if it is white 
        // and half the height of the sprites if it is black
        let sy = black ? 213 : 0;
        let sx = ['k', 'q', 'b', 'n', 'r', 'p'].indexOf(name.toLowerCase()) * 213;
        let coord = ChessCanvas.getCoords(index);
        this.ctx.drawImage(this.img, sx, sy, 213, 213, coord.x * ChessCanvas.boxScale, coord.y * ChessCanvas.boxScale, ChessCanvas.boxScale, ChessCanvas.boxScale);
    }
    static getCoords(index) {
        let result = {
            x: index % 8,
            y: index >> 3,
        };
        return result;
    }
    static getIndex(coord) {
        return coord.x + coord.y * 8;
    }
    static getClickedCoord(mouseCoord) {
        mouseCoord.x = Math.floor(mouseCoord.x / ChessCanvas.boxScale);
        mouseCoord.y = Math.floor(mouseCoord.y / ChessCanvas.boxScale);
        return mouseCoord;
    }
    static getCLickedIndex(mouseCoord) {
        let clickedCoord = ChessCanvas.getClickedCoord(mouseCoord);
        return clickedCoord.x + clickedCoord.y * 8;
    }
}
ChessCanvas.boxScale = window.innerHeight >> 3;
