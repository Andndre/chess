import { ChessGame } from "./chessGame.js";
const playBtn = document.getElementById("play");
playBtn.onclick = (_ev) => {
    document.getElementById("main-menu").style.display = "none";
    new ChessGame(document.getElementById("canvas"), "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
};
