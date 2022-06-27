import { NONE } from "./constants.js";
import { availableMoveColor, checkColor, darkTileColor, lightTileColor, moveFromColor, moveToColor, } from "./config.js";
import { getCoords } from "./coordinates.js";
import { Color } from "./piece.js";
import { SpritesManager } from "./spritesManager.js";
import { log } from "./utils.js";
export class Renderer {
    constructor(board, canvasManager, mover) {
        log(1, "creating Renderer");
        this.board = board;
        this.sprite = new SpritesManager(document.getElementById("sprite"), 6, 2);
        this.canvasManager = canvasManager;
        this.mover = mover;
        log(-1, "");
    }
    /**
     * Draw a square on the canvas at the given index, with the given color.
     * @param {string} color - The color of the square.
     * @param {Vector} coords - The coordinates of the square you want to draw.
     */
    drawSquare(color, coords) {
        // log(1, "drawing square ", color, " in ", coords);
        const ctx = this.canvasManager.getContext();
        ctx.fillStyle = color;
        let square = this.canvasManager.getCanvas().width / 8;
        ctx.fillRect(coords.x * square, coords.y * square, square, square);
        // log(-1, "");
    }
    /**
     * This function combines all the drawing functions.
     */
    render() {
        // log(1, "---render---");
        // draw the board
        for (let file = 0; file < 8; file++) {
            for (let rank = 0; rank < 8; rank++) {
                // get the color of the square
                let color = (file + rank) % 2 == 0 ? lightTileColor : darkTileColor;
                // draw the square
                this.drawSquare(color, {
                    x: rank,
                    y: file,
                });
            }
        }
        if (this.board.checkIndex != NONE) {
            this.drawSquare(checkColor, getCoords(this.board.checkIndex));
        }
        // draw last move
        if (this.mover.history.length != 0) {
            this.drawMove(this.mover.history[this.mover.history.length - 1]);
        }
        if (this.mover.selectedIndex != NONE) {
            this.drawSquare(moveToColor, getCoords(this.mover.selectedIndex));
        }
        // draw available moves
        this.drawAvailableMoves();
        // draw check
        this.drawCheck();
        // draw the pieces
        this.drawPieces();
        // log(-1, "");
    }
    /**
     * This function draws a move on the board. It draws a square from the start index to the end index.
     * @param move - Move - the move to draw
     */
    drawMove(move) {
        // log(1, "drawing move ", move);
        this.drawSquare(moveFromColor, getCoords(move.from.index));
        this.drawSquare(moveToColor, getCoords(move.to.index));
        // log(-1, "");
    }
    drawCheck() {
        for (const color of [Color.white, Color.black]) {
            // This line will not be evaluated ever! because Color.none will never be used.
            // Just because the typescript compiler was yelling at me ;(
            if (color == Color.none)
                continue;
            if (this.mover.checkIndex[color] !== NONE) {
                this.drawSquare(checkColor, getCoords(this.mover.checkIndex[color]));
            }
        }
    }
    /**
     * If a piece is selected, draw a square around all the available moves for that piece
     * @returns the index of the selected piece.
     */
    drawAvailableMoves() {
        const isNone = this.mover.selectedIndex == NONE;
        // log(1, "drawing av moves ", isNone);
        if (isNone)
            return;
        const moves = this.mover.legalMoves[this.mover.selectedIndex];
        for (const move of moves) {
            this.drawSquare(availableMoveColor, getCoords(move.to.index));
        }
        // log(-1, "");
    }
    /**
     * This function draws all the pieces on the board.
     */
    drawPieces() {
        // log(1, "drawing pieces");
        for (let i = 0; i < 64; i++) {
            this.drawPiece(this.board.tiles[i]);
        }
        // log(-1, "");
    }
    /**
     * It draws a piece on the board
     * @param {Piece} piece - Piece - the piece to draw
     */
    drawPiece(piece) {
        // log(1, "drawing piece ", piece);
        const { x: sx, y: sy } = this.sprite.getPieceCoords(piece);
        const { x: dx, y: dy } = getCoords(piece.index);
        this.sprite.drawToBoard(this.canvasManager, sx, sy, dx, dy, false);
        // log(-1, "");
    }
}
