import { availableMoveColor, checkColor, darkTileColor, lightTileColor, moveFromColor, moveToColor, } from "./config.js";
import { getCoords, getIndex } from "./coordinates.js";
import { board, ctx, getScaledSize } from "./globals.js";
import { flip } from "./index.js";
import Piece from "./piece.js";
/* It draws a chess board and pieces on a canvas. */
export default class Renderer {
    constructor() {
        this.sprite = document.getElementById("sprite");
    }
    /**
     * If the instance is undefined, create a new instance and return it. Otherwise, return the existing
     * instance.
     * @returns The instance of the Renderer class.
     */
    static get() {
        if (this.instance == undefined) {
            this.instance = new Renderer();
        }
        return this.instance;
    }
    /**
     * Draw a square on the canvas at the given index, with the given color.
     * @param {string} color - The color of the square.
     * @param {number} index - The index of the square you want to draw.
     */
    drawSquare(color, index) {
        let [x, y] = getCoords(index);
        ctx.fillStyle = color;
        let square = getScaledSize() / 8;
        ctx.fillRect(x * square, y * square, square, square);
    }
    /**
     * This function combines all the drawing functions.
     */
    drawBoard() {
        // draw the board
        for (let file = 0; file < 8; file++) {
            for (let rank = 0; rank < 8; rank++) {
                // get the color of the square
                let index = getIndex(file, rank);
                let color = (file + rank) % 2 == 0 ? lightTileColor : darkTileColor;
                // draw the square
                this.drawSquare(color, index);
            }
        }
        if (board.checkIndex != -1) {
            this.drawSquare(checkColor, board.checkIndex);
        }
        // draw last move
        if (board.lastMove != undefined) {
            this.drawMove(board.lastMove);
        }
        if (board.selectedIndex != -1) {
            this.drawSquare(moveToColor, board.selectedIndex);
        }
        // draw available moves
        this.drawAvailableMoves();
        // draw the pieces
        this.drawPieces();
    }
    /**
     * This function draws a move on the board. It draws a square from the start index to the end index.
     * @param move - Move - the move to draw
     */
    drawMove(move) {
        this.drawSquare(moveFromColor, move.from);
        this.drawSquare(moveToColor, move.to);
    }
    /**
     * If a piece is selected, draw a square around all the available moves for that piece
     * @returns the index of the selected piece.
     */
    drawAvailableMoves() {
        if (board.selectedIndex == -1)
            return;
        let availableMoves = board.availableMoves[board.selectedIndex];
        for (let index of availableMoves) {
            this.drawSquare(availableMoveColor, index);
        }
    }
    /**
     * This function draws all the pieces on the board.
     */
    drawPieces() {
        let allPieces = board.getAllPieces();
        for (let piece of allPieces) {
            this.drawPiece(piece);
        }
    }
    /**
     * It draws a piece on the board
     * @param {Piece} piece - Piece - the piece to draw
     */
    drawPiece(piece) {
        ctx.save();
        let black = piece.isColor(Piece.black);
        let rotate = board.colorToMove == (board.playAsWhite ? Piece.black : Piece.white);
        let singleSpriteSize = this.sprite.width / 6;
        let sy = black ? singleSpriteSize : 0;
        let squareScale = getScaledSize() / 8;
        let sx = [
            Piece.king,
            Piece.queen,
            Piece.bishop,
            Piece.knight,
            Piece.rook,
            Piece.pawn,
        ].indexOf(piece.getType()) * singleSpriteSize;
        let [x, y] = getCoords(piece.index);
        // rotate when it's enemy's turn
        let sign = 1;
        let div = 1;
        if (rotate && flip) {
            ctx.translate((x / 2) * squareScale + squareScale, (y / 2) * squareScale + squareScale);
            ctx.rotate(Math.PI);
            sign = -1;
            div = 2;
        }
        // draw the piece
        ctx.drawImage(this.sprite, sx, sy, singleSpriteSize, singleSpriteSize, (x * squareScale * sign) / div, (y * squareScale * sign) / div, squareScale, squareScale);
        ctx.restore();
    }
}
