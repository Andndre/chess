class Board {
	static instance?: Board;

	public colorToMove: number = Piece.white;
	public lastMove?: Move;
	public lastLastMove?: Move;

	public lastMoveToData?: number;
	public lastMoveFromData?: number;

	public checkIndex?: number;
	public checkMate = false;

	public isKingHasMoved: boolean[] = [true, true];
	public isRookHasMoved: boolean[] = [true, true, true, true];

	public availableMoves: number[][] = [];
	public playAsWhite: boolean = true;

	public square: Piece[];
	public kings: Piece[];

	public selectedIndex: number = -1;

	public numToEdge: number[][] = [];
	public directionOffsets = [8, -8, -1, 1, 7, -7, 9, -9];

	private constructor() {
		this.square = [];
		this.kings = [];

		// precompute the distnce from each square to the edge of the board for each direction
		for (let file = 0; file < 8; file++) {
			for (let rank = 0; rank < 8; rank++) {
				let numNorth = 7 - rank;
				let numSouth = rank;
				let numWest = file;
				let numEast = 7 - file;

				let squareIndex = getIndex(file, rank);

				// define the distance to the edge of the board for each direction for each square
				this.numToEdge[squareIndex] = [
					numNorth,
					numSouth,
					numWest,
					numEast,
					Math.min(numNorth, numWest),
					Math.min(numSouth, numEast),
					Math.min(numNorth, numEast),
					Math.min(numSouth, numWest),
				];
			}
		}
	}

	public select(index: number) {
		if (this.selectedIndex != -1) {
			if (this.availableMoves[this.selectedIndex].indexOf(index) != -1) {
				this.move(new Move(this.selectedIndex, index));
				this.checkMate = Move.generateMoves();
				this.selectedIndex = -1;
			}
			if (this.square[index].getColor() == this.colorToMove) {
				this.selectedIndex = index;
			}
			return;
		}
		let piece = this.square[index];
		if (piece.getColor() != this.colorToMove) return;
		let type = piece.getType();
		if (type == Piece.none) return;
		this.selectedIndex = index;
	}

	// returns true if the move put the enemy king in check
	public move(move: Move, test = false): boolean {
		this.lastMoveToData = this.square[move.to].data;
		this.lastMoveFromData = this.square[move.from].data;

		if (!test) {
			// make isRookHasMoved[i] true if the move.from or the move.to is a rook
			let idx = getRookIndex(move.from);
			if (idx != -1) {
				this.isRookHasMoved[idx] = true;
			}
			idx = getRookIndex(move.to);
			if (idx != -1) {
				this.isRookHasMoved[idx] = true;
			}
		}

		// move the piece
		this.square[move.to].data = this.square[move.from].data;
		this.square[move.from].data = Piece.none;

		if (this.square[move.to].getType() == Piece.king) {
			let index = this.colorToMove == Piece.white ? 0 : 1;
			this.kings[index] = this.square[move.to];
			if (!test) {
				this.isKingHasMoved[index] = true;
				let offset = move.to - move.from;
				if (Math.abs(offset) == 2) {
					// castling
					let rookIndex = move.from + (offset < 0 ? -4 : 3);
					let rookFinal = move.from + (offset >> 1);
					this.isRookHasMoved[getRookIndex(rookIndex)] = true;
					this.square[rookFinal].data = this.square[rookIndex].data;
					this.square[rookIndex].data = 0;
				}
			}
		}

		if (Piece.getType(this.lastMoveFromData) == Piece.pawn) {
			let [, y] = getCoords(move.to);
			// if the pawn is at the end of the board, promote it
			if (y == 0 || y == 7) {
				// promote pawn to queen
				// TODO: make this a dropdown menu
				let pawn = this.square[move.to];
				pawn.data = this.colorToMove | Piece.queen;
			}
		}

		// switch player
		let isWhite = this.colorToMove == Piece.white;
		this.colorToMove = isWhite ? Piece.black : Piece.white;
		this.lastLastMove = this.lastMove;
		this.lastMove = new Move(move.from, move.to);

		return this.isCheck();
	}

	public undoMove() {
		if (this.lastMove == undefined) return;
		let move = this.lastMove!;
		this.square[move.from].data = this.lastMoveFromData!;
		this.square[move.to].data = this.lastMoveToData!;
		this.colorToMove = Piece.invertColor(this.colorToMove);
		if (this.square[move.from].getType() == Piece.king) {
			this.kings[this.colorToMove == Piece.white ? 0 : 1] =
				this.square[move.from];
		}
		this.lastMove = this.lastLastMove;
		this.lastLastMove = undefined;
	}

	public isCheck(): boolean {
		this.checkIndex = undefined;
		let enemyKingIndex =
			this.kings[this.colorToMove == Piece.white ? 1 : 0].index;
		if (Move.isAttacked(enemyKingIndex)) {
			this.checkIndex = enemyKingIndex;
			return true;
		}
		return false;
	}

	public getAllPieces(): Piece[] {
		let pieces: Piece[] = [];
		for (let i = 0; i < 64; i++) {
			let piece = this.square[i];
			if (piece.getType() != Piece.none) {
				pieces.push(piece);
			}
		}
		return pieces;
	}

	public getFriendlyPieces(color: number): Piece[] {
		let pieces: Piece[] = [];
		for (let piece of this.square) {
			if (piece.getColor() == color) {
				pieces.push(piece);
			}
		}
		return pieces;
	}

	// get the board instance or create a new one if it doesn't exist
	static get(): Board {
		if (this.instance == undefined) {
			this.instance = new Board();
		}
		return this.instance!;
	}

	// load the board with the given fen position
	// fen : https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation
	public loadFenPositions(fen: string) {
		let index = 0;
		let fenComponents = fen.split(" ");
		let fenPositions = fenComponents[0].split("/");
		this.playAsWhite = fenComponents[1] == "w";
		this.colorToMove = this.playAsWhite ? Piece.white : Piece.black;
		// loop through each row
		for (let row of fenPositions) {
			// loop through each character in the row
			for (let char of row) {
				// if the character is a number, add that many blank squares to the board
				if (["1", "2", "3", "4", "5", "6", "7", "8", "9"].indexOf(char) != -1) {
					let num = Number.parseInt(char);
					// fill with none
					fillTypeRange(this.square, index, index + num, Piece.none);
					// skip
					index += num;
					continue;
				}
				// if the character is a letter, add that piece to the board
				let piece = new Piece(index, Piece.getTypeFromChar(char)!);
				// add the piece to the board
				this.square[index] = piece;
				let white = isUpperCase(char);
				// set the piece's colour
				this.square[index].data |= white ? Piece.white : Piece.black;
				if (piece.getType() == Piece.king) {
					if (index == 4 || index == 60) {
						if (white && index == (this.playAsWhite ? 60 : 4)) {
							this.isKingHasMoved[white ? 0 : 1] = false;
						} else if (!white && index == (this.playAsWhite ? 4 : 60)) {
							this.isKingHasMoved[white ? 0 : 1] = false;
						}
					}
					this.kings[white ? 0 : 1] = piece;
				} else if (piece.getType() == Piece.rook) {
					if (index == 0 || index == 7 || index == 56 || index == 63) {
						this.isRookHasMoved[getRookIndex(index)] = false;
					}
				}
				index++;
			}
		}
		Move.generateMoves();
	}
}
