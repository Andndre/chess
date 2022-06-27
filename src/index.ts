import { ChessGame } from "./chessGame.js";

new ChessGame(
	document.getElementById("canvas") as HTMLCanvasElement,
	"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
);
