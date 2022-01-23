"use strict";
var _a;
let canvas = document.getElementById('canvas');
let chess = new Chess('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
let chessCanvas = new ChessCanvas(chess, canvas);
canvas.addEventListener('click', (e) => {
    if (chess.clicked(ChessCanvas.getCLickedIndex({ x: e.clientX, y: e.clientY }))) {
        chessCanvas.draw();
    }
    ;
});
(_a = document.getElementById('sprite')) === null || _a === void 0 ? void 0 : _a.addEventListener('load', () => chessCanvas.draw());
