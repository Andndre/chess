let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;

window.onload = () => {
	canvas = document.getElementById("canvas") as HTMLCanvasElement;
	let size =
		window.innerWidth > window.innerHeight
			? window.innerHeight
			: window.innerWidth;
	canvas.width = size;
	canvas.height = size;
	ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
	Board.get().loadFenPositions(
		"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
	);
	let renderer = Renderer.get();
	renderer.drawBoard();
	canvas.addEventListener("click", (event) => {
		let index = getClickedIndex(event);
		let board = Board.get();
		board.select(index);
		renderer.drawBoard();
	});
};
