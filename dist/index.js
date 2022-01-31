"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let canvas;
let ctx;
window.onload = () => {
    canvas = document.getElementById("canvas");
    let size = window.innerWidth > window.innerHeight
        ? window.innerHeight
        : window.innerWidth;
    canvas.width = size;
    canvas.height = size;
    ctx = canvas.getContext("2d");
    Board.get().loadFenPositions("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    let renderer = Renderer.get();
    renderer.drawBoard();
    canvas.addEventListener("click", (event) => __awaiter(void 0, void 0, void 0, function* () {
        let index = getClickedIndex(event);
        let board = Board.get();
        board.select(index);
        renderer.drawBoard();
        // without this the alert will pause the game before the canvas gets updated
        yield sleep(0);
        if (board.checkMate) {
            alert("Checkmate!");
        }
    }));
};
