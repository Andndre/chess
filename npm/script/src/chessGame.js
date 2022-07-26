"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChessGame = void 0;
const board_js_1 = require("./board.js");
const mover_js_1 = require("./mover.js");
class ChessGame {
    constructor(fen, fiftyMoveRuleEnabled = true) {
        Object.defineProperty(this, "board", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "mover", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "gameOver", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "fiftyMoveRule", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "gameOverReason", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'not true'
        });
        Object.defineProperty(this, "onMove", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => { }
        });
        Object.defineProperty(this, "onUndo", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => { }
        });
        Object.defineProperty(this, "onCapture", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => { }
        });
        Object.defineProperty(this, "onWhitePromote", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => { }
        });
        Object.defineProperty(this, "onBlackPromote", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => { }
        });
        Object.defineProperty(this, "onCastle", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => { }
        });
        Object.defineProperty(this, "onGameOver", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => { }
        });
        this.board = new board_js_1.Board();
        this.mover = new mover_js_1.Mover(this.board, this, fen);
        this.fiftyMoveRule = fiftyMoveRuleEnabled;
    }
    static newStandardGame() {
        return new ChessGame('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
    }
    /**
     * If you use this, this.checkMate, this.staleMate, this.gameOver,
     * and other states that happen in late game might be wrong.
     */
    static newGameFromFEN(fen) {
        return new ChessGame(fen);
    }
    on(ev, callBack) {
        switch (ev) {
            case 'move':
                this.onMove = callBack;
                return;
            case 'capture':
                this.onCapture = callBack;
                return;
            case 'whitePromote':
                this.onWhitePromote = callBack;
                return;
            case 'blackPromote':
                this.onBlackPromote = callBack;
                return;
            case 'undo':
                this.onUndo = callBack;
                return;
            case 'castle':
                this.onCastle = callBack;
                return;
            case 'gameOver':
                this.onGameOver = callBack;
        }
    }
}
exports.ChessGame = ChessGame;
