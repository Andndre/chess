import { ChessGame } from "./chessGame.js";

const playBtn = document.getElementById("play")! as HTMLButtonElement;

playBtn.onclick = (_ev) => {
	document.getElementById("main-menu")!.style.display = "none";
	new ChessGame(
		document.getElementById("canvas") as HTMLCanvasElement,
		"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
	);
};
