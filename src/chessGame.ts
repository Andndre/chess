import { Board } from "./board.js";
import { CanvasManager } from "./canvasManager.js";
import { NONE } from "./constants.js";
import { getClickedIndex } from "./coordinates.js";
import { Mover } from "./mover.js";
import { Color } from "./piece.js";
import { Renderer } from "./renderer.js";
import { sleep } from "./utils.js";

export class ChessGame {
	canvas: HTMLCanvasElement;
	fen: string;
	canvasManager: CanvasManager;
	board: Board;
	mover: Mover;
	renderer: Renderer;
	constructor(canvas: HTMLCanvasElement, fen: string) {
		this.canvas = canvas;
		this.fen = fen;
		this.canvasManager = new CanvasManager(canvas);
		this.board = new Board("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
		this.mover = new Mover(this.board);
		this.renderer = new Renderer(this.board, this.canvasManager, this.mover);
		this.mover.timers[16].element.style.display = "block";
		this.mover.timers[8].element.style.display = "block";
		canvas.style.display = "block";

		this.windowResized();

		this.renderer.render();

		window.addEventListener("resize", () => this.windowResized(this));
		canvas.addEventListener("click", async (event) => {
			const index = getClickedIndex(event, this.canvasManager);
			this.mover.selectTile(index);
			this.renderer.render();
			// without this the alert will pause the game before the canvas gets updated
			await sleep(10);
			if (this.mover.checkMate) {
				alert("Checkmate!");
			}
		});

		window.addEventListener("keydown", (ev) => {
			if (ev.key === "z" && ev.ctrlKey) {
				this.mover.undoMove();
				this.mover.checkIndex[Color.white] = NONE;
				this.mover.checkIndex[Color.black] = NONE;
				this.mover.generateNextMove();
				this.renderer.render();
			}
		});

		/* Adding an event listener to the document for when the fullscreen changes. */
		["", "webkit", "moz", "ms"].forEach((prefix) =>
			document.addEventListener(
				prefix + "fullscreenchange",
				() => this.windowResized(this),
				false
			)
		);
	}

	windowResized(obj = this) {
		const canvasSize = Math.min(window.innerHeight, window.innerWidth);
		const timersContainer = document.getElementsByClassName(
			"timers"
		)[0] as HTMLElement;
		timersContainer.style.flexDirection =
			window.innerHeight < window.innerWidth ? "row" : "column";
		obj.canvasManager.setHeight(canvasSize);
		obj.canvasManager.setWidth(canvasSize);
		obj.renderer.render();
	}
}
