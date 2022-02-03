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
let param = new URLSearchParams(window.location.search);
let fen = param.get("fen") ||
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
let flip = (param.get("flip") || "1") == "1";
let rel = param.get("fen") == null || param.get("flip") == null;
if (rel) {
    window.location.search = new URLSearchParams({
        fen: fen,
        flip: flip ? "1" : "0",
    }).toString();
}
let canvas;
let ctx;
let size;
let scaledSize;
let scale = window.devicePixelRatio;
window.onload = () => {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    Board.get().loadFenPositions(fen);
    let renderer = Renderer.get();
    onResize();
    window.addEventListener("resize", onResize);
    canvas.addEventListener("click", (event) => __awaiter(void 0, void 0, void 0, function* () {
        let index = getClickedIndex(event);
        let board = Board.get();
        board.select(index);
        renderer.drawBoard();
        // without this the alert will pause the game before the canvas gets updated
        yield sleep(10);
        if (board.checkMate) {
            alert("Checkmate!");
        }
    }));
    ["", "webkit", "moz", "ms"].forEach((prefix) => document.addEventListener(prefix + "fullscreenchange", onResize, false));
};
function onResize() {
    size =
        window.innerWidth > window.innerHeight
            ? window.innerHeight
            : window.innerWidth;
    scaledSize = Math.floor(size * scale);
    canvas.width = scaledSize;
    canvas.height = scaledSize;
    Renderer.get().drawBoard();
}
