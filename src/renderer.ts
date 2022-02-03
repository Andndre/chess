class Renderer {
	static instance?: Renderer;
	public sprite: CanvasImageSource;
	private constructor() {
		this.sprite = document.getElementById("sprite") as CanvasImageSource;
	}

	static get(): Renderer {
		if (this.instance == undefined) {
			this.instance = new Renderer();
		}
		return this.instance!;
	}

	// draw a box with the given color and index
	public drawBox(color: string, index: number): void {
		let [x, y] = getCoords(index);
		ctx.fillStyle = color;
		let boxScale = scaledSize / 8;
		ctx.fillRect(x * boxScale, y * boxScale, boxScale, boxScale);
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
		ctx.save();
		let board = Board.get();
		let black = piece.isColor(Piece.black);
		let rotate =
			board.colorToMove == (board.playAsWhite ? Piece.black : Piece.white);
		let singleSpriteSize = (this.sprite.width as number) / 6;
		let sy = black ? singleSpriteSize : 0;
		let boxScale = scaledSize / 8;
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
		// rotate when it's enemy's turn
		let sign = 1;
		let div = 1;
		if (rotate && flip) {
			ctx.translate(
				(x / 2) * boxScale + boxScale,
				(y / 2) * boxScale + boxScale
			);
			ctx.rotate(Math.PI);
			sign = -1;
			div = 2;
		}
		// draw the piece
		ctx.drawImage(
			this.sprite,
			sx,
			sy,
			singleSpriteSize,
			singleSpriteSize,
			(x * boxScale * sign) / div,
			(y * boxScale * sign) / div,
			boxScale,
			boxScale
		);

		ctx.restore();
	}
}
