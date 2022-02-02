type CellPieceInfo = "enemy" | "none" | "friend";

class Move {
	public from: number;
	public to: number;
	constructor(from: number, to: number) {
		this.from = from;
		this.to = to;
	}

	static insertAvMove({
		move,
		moves,
		insertIf = ["enemy", "none"],
	}: {
		move: Move;
		moves: number[];
		insertIf?: CellPieceInfo[];
	}): boolean {
		let board = Board.get();
		let piece = board.square[move.from];
		let pieceTo = board.square[move.to];
		let color = piece.getColor();
		let colorTo = pieceTo.getColor();
		if (Piece.invertColor(color) == colorTo) {
			if (insertIf.indexOf("enemy") != -1) {
				moves.push(move.to);
				return true;
			}
			return false;
		}
		if (colorTo == Piece.none) {
			if (insertIf.indexOf("none") != -1) {
				moves.push(move.to);
				return true;
			}
			return false;
		}
		if (insertIf.indexOf("friend") != -1) {
			moves.push(move.to);
			return true;
		}
		return false;
	}

	// check if move is legal
	public isLegal(): boolean {
		let board = Board.get();
		let result = board.move(this, true);
		board.undoMove();
		return !result;
	}

	// get all possible moves
	static generateAvailableLegalMoves(from: number): number[] {
		let result: number[] = [];

		// generate move using `generateAvailableMoves` function and insert it into `result` array and then filter it so all moves that are not legal are removed
		let moves = Move.generateAvailableMoves(from);
		for (let i = 0; i < moves.length; i++) {
			let move = new Move(from, moves[i]);
			if (move.isLegal()) {
				result.push(moves[i]);
			}
		}
		return result;
	}

	static generateMoves() {
		let board = Board.get();
		let checkMate = true;
		for (let i = 0; i < 64; i++) {
			let piece = board.square[i];
			if (
				piece.getColor() == Piece.none ||
				piece.getColor() != board.colorToMove
			) {
				continue;
			}
			let moves = Move.generateAvailableLegalMoves(i);
			if (checkMate) {
				checkMate = moves.length == 0;
			}
			board.availableMoves[i] = moves;
		}
		return checkMate;
	}

	static generateAvailableMoves(from: number): number[] {
		let board = Board.get();
		let result: number[] = [];
		let piece = board.square[from];
		let white = Piece.isColor(piece.data, Piece.white);
		// RNBQKBNR
		// ROOKS //
		if (piece.getType() === Piece.rook) {
			result.push(...Move.alignAxisMove(from));
		}
		// KNIGHTS //
		else if (piece.getType() == Piece.knight) {
			result.push(...Move.knightMove(from));
		}
		// BISHOPS //
		else if (piece.getType() == Piece.bishop) {
			result.push(...Move.diagonalAxisMove(from));
		}
		// QUEEN //
		else if (piece.getType() == Piece.queen) {
			result.push(...Move.alignAxisMove(from));
			result.push(...Move.diagonalAxisMove(from));
		}
		// KING //
		else if (piece.getType() == Piece.king) {
			let kingMove = this.kingMove(from);
			if (!board.isKingHasMoved[white ? 0 : 1] && board.checkIndex != from) {
				for (let i = 2; i <= 3; i++) {
					let canCastle = true;
					let sign = i % 2 == 0 ? 1 : -1;
					for (let j = 1; j <= i; j++) {
						let index = from + sign * j;
						if (board.square[index].getType() != 0) {
							canCastle = false;
							break;
						}
					}
					let rookIndex = getRookIndex(from + sign * (i + 1));
					console.log(kingMove);
					if (
						canCastle &&
						!board.isRookHasMoved[rookIndex] &&
						new Move(from, from + sign).isLegal()
					) {
						result.push(from + sign * 2);
					}
				}
			}
			result.push(...kingMove);
		}
		// PAWNS //
		else if (piece.getType() == Piece.pawn) {
			result.push(...Move.pawnMove(from));
		}

		return result;
	}

	static pawnMove(from: number): number[] {
		let result: number[] = [];
		let board = Board.get();
		let offset =
			board.square[from].getColor() ==
			(board.playAsWhite ? Piece.white : Piece.black)
				? -8
				: 8;
		let index = from + offset;
		let [, y] = getCoords(from);

		if (
			Move.insertAvMove({
				move: new Move(from, index),
				moves: result,
				insertIf: ["none"],
			})
		) {
			if (y == (offset == 8 ? 1 : 6)) {
				Move.insertAvMove({
					move: new Move(from, index + offset),
					moves: result,
					insertIf: ["none"],
				});
			}
		}

		if (index % 8 != 0) {
			Move.insertAvMove({
				move: new Move(from, index - 1),
				moves: result,
				insertIf: ["enemy"],
			});
		}

		if ((index - 7) % 8 != 0) {
			Move.insertAvMove({
				move: new Move(from, index + 1),
				moves: result,
				insertIf: ["enemy"],
			});
		}

		return result;
	}

	static isAttacked(index: number): boolean {
		let board = Board.get();
		if (board.square[index].getType() == 0) return false;
		let color = Piece.invertColor(board.square[index].getColor());
		let moveFuncs = [
			Move.alignAxisMove,
			Move.diagonalAxisMove,
			Move.kingMove,
			Move.knightMove,
			Move.pawnMove,
		];
		let movePieces = [
			[color | Piece.rook, color | Piece.queen],
			[color | Piece.bishop, color | Piece.queen],
			[color | Piece.king],
			[color | Piece.knight],
			[color | Piece.pawn],
		];
		for (let idx in moveFuncs) {
			let moves = moveFuncs[idx](index);
			let attacked = Piece.includesData(moves, ...movePieces[idx]);
			if (attacked) {
				return true;
			}
		}
		return false;
	}

	static knightMove(from: number): number[] {
		let result: number[] = [];
		let [x, y] = getCoords(from);
		let range = [
			[-2, 2],
			[-1, 1],
		];
		for (let i = 0; i < 2; i++) {
			for (let xOffset of range[i]) {
				for (let yOffset of range[1 - i]) {
					if (
						x + xOffset < 0 ||
						x + xOffset > 7 ||
						y + yOffset < 0 ||
						y + yOffset > 7
					)
						continue;
					let index = getIndex(x + xOffset, y + yOffset);
					Move.insertAvMove({ move: new Move(from, index), moves: result });
				}
			}
		}

		return result;
	}

	static kingMove(from: number): number[] {
		let result: number[] = [];
		let range = [
			[-1, 1],
			[-1, 0],
			[-1, -1],
			[0, -1],
			[1, -1],
			[1, 0],
			[1, 1],
			[0, 1],
		];
		let coord = getCoords(from);
		for (let i = 0; i < 8; i++) {
			let xOffset = range[i][0];
			let yOffset = range[i][1];
			let xFinal = coord[0] + xOffset;
			let yFinal = coord[1] + yOffset;
			if (xFinal < 0 || xFinal > 7 || yFinal < 0 || yFinal > 7) continue;
			let index = getIndex(xFinal, yFinal);
			Move.insertAvMove({ move: new Move(from, index), moves: result });
		}
		return result;
	}

	static alignAxisMove(from: number): number[] {
		let board = Board.get();
		let piece = board.square[from];
		let colorToMove = piece.getColor();
		let moves: number[] = [];

		for (let i = 0; i < 4; i++) {
			let current = from;
			let dirrection = board.directionOffsets[i];
			for (let j = 0; j < board.numToEdge[from][i]; j++) {
				current += dirrection;
				let color = board.square[current].getColor();
				if (color == Piece.none || color == Piece.invertColor(colorToMove)) {
					moves.push(current);
				}
				if (color == colorToMove || color == Piece.invertColor(colorToMove)) {
					break;
				}
			}
		}
		return moves;
	}

	static diagonalAxisMove(from: number): number[] {
		let board = Board.get();
		let piece = board.square[from];
		let colorToMove = piece.getColor();
		let moves: number[] = [];

		for (let i = 4; i < 9; i++) {
			let current = from;
			let dirrection = board.directionOffsets[i];
			for (let j = 0; j < board.numToEdge[from][i]; j++) {
				current += dirrection;
				let color = board.square[current].getColor();
				if (color == Piece.none || color == Piece.invertColor(colorToMove)) {
					moves.push(current);
				}
				if (color == colorToMove || color == Piece.invertColor(colorToMove)) {
					break;
				}
			}
		}
		return moves;
	}
}
