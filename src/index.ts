import { Board } from "./board.js";
import { CanvasManager } from "./canvasManager.js";
import { NONE } from "./constants.js";
import { getClickedIndex } from "./coordinates.js";
import { Mover } from "./mover.js";
import { Renderer } from "./renderer.js";
import { sleep } from "./utils.js";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const canvasManager = new CanvasManager(canvas);
const board = new Board("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
const mover = new Mover(board);
const renderer = new Renderer(board, canvasManager, mover);

windowResized();

renderer.render();

window.addEventListener("resize", windowResized);
canvas.addEventListener("click", async (event) => {
	const index = getClickedIndex(event, canvasManager);
	mover.selectTile(index);
	renderer.render();
	// without this the alert will pause the game before the canvas gets updated
	await sleep(10);
	if (mover.checkMate) {
		alert("Checkmate!");
	}
});

window.addEventListener("keydown", (ev) => {
	if (ev.key === "z" && ev.ctrlKey) {
		mover.undoMove();
		mover.checkIndex[16] = NONE;
		mover.checkIndex[8] = NONE;
		mover.generateNextMove();
		renderer.render();
	}
});

/* Adding an event listener to the document for when the fullscreen changes. */
["", "webkit", "moz", "ms"].forEach((prefix) =>
	document.addEventListener(prefix + "fullscreenchange", windowResized, false)
);

function windowResized() {
	const canvasSize = Math.min(window.innerHeight, window.innerWidth);

	canvasManager.setHeight(canvasSize);
	canvasManager.setWidth(canvasSize);
	renderer.render();
}
