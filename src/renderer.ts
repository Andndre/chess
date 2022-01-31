class Renderer {
	static instance?: Renderer;
	public ctx: CanvasRenderingContext2D;
	public size: number;
	public sprite: CanvasImageSource;
	private constructor(size: number) {
		this.ctx = ctx;
		this.size = size;
		this.sprite = document.getElementById("sprite") as CanvasImageSource;
	}

	static get(): Renderer {
		if (this.instance == undefined) {
			this.instance = new Renderer(canvas.width);
		}
		return this.instance!;
	}

	// draw a box with the given color and index
	public drawBox(color: string, index: number): void {
		let [x, y] = getCoords(index);
		this.ctx.fillStyle = color;
		let boxScale = this.size / 8;
		this.ctx.fillRect(x * boxScale, y * boxScale, boxScale, boxScale);
	}

	public drawBoard(): void {
		let board = Board.get();
		// draw the board
		for (let file = 0; file < 8; file++) {
			for (let rank = 0; rank < 8; rank++) {
				// get the color of the square
				let index = getIndex(file, rank);
				let color = (file + rank) % 2 == 0 ? lightTileColor : darkTileColor;
				// draw the square
				this.drawBox(color, index);
			}
		}
		if (board.checkIndex != undefined) {
			this.drawBox(checkColor, board.checkIndex);
		}
		// draw last move
		if (board.lastMove != undefined) {
			this.drawMove(board.lastMove!);
		}
		if (board.selectedIndex != undefined) {
			this.drawBox(moveToColor, board.selectedIndex);
		}
		// draw available moves
		this.drawAvailableMoves();
		// draw the pieces
		this.drawPieces();
	}

	public drawMove(move: Move): void {
		this.drawBox(moveFromColor, move.from);
		this.drawBox(moveToColor, move.to);
	}

	public drawAvailableMoves(): void {
		let board = Board.get();
		if (board.selectedIndex == -1) return;
		let availableMoves = board.availableMoves[board.selectedIndex!];
		for (let index of availableMoves) {
			this.drawBox(availableMoveColor, index);
		}
	}

	public drawPieces(): void {
		let board = Board.get();
		let allPieces = board.getAllPieces();
		for (let piece of allPieces) {
			this.drawPiece(piece);
		}
	}

	public drawPiece(piece: Piece): void {
		let black = piece.isColor(Piece.black);
		let singleSpriteSize = (this.sprite.width as number) / 6;
		let sy = black ? singleSpriteSize : 0;
		let boxScale = this.size / 8;
		let sx =
			[
				Piece.king,
				Piece.queen,
				Piece.bishop,
				Piece.knight,
				Piece.rook,
				Piece.pawn,
			].indexOf(piece.getType()) * singleSpriteSize;
		let [x, y] = getCoords(piece.index);
		// draw the piece
		this.ctx.drawImage(
			this.sprite,
			sx,
			sy,
			singleSpriteSize,
			singleSpriteSize,
			x * boxScale,
			y * boxScale,
			boxScale,
			boxScale
		);
	}
}
