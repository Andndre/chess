let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let size: number;
let scaledSize: number;
let scale = window.devicePixelRatio;

window.onload = () => {
	canvas = document.getElementById("canvas") as HTMLCanvasElement;
	ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
	Board.get().loadFenPositions(
		"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
	);
	let renderer = Renderer.get();
	onResize();
	window.addEventListener("resize", onResize);
	canvas.addEventListener("click", async (event) => {
		let index = getClickedIndex(event);
		let board = Board.get();
		board.select(index);
		renderer.drawBoard();
		// without this the alert will pause the game before the canvas gets updated
		await sleep(10);
		if (board.checkMate) {
			alert("Checkmate!");
		}
	});
	["", "webkit", "moz", "ms"].forEach((prefix) =>
		document.addEventListener(prefix + "fullscreenchange", onResize, false)
	);
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
