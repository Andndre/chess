import { getCoords, getIndex } from "./coordinates.js";
import { board } from "./globals.js";
import Piece from "./piece.js";
import { getRookIndex } from "./utils.js";

export type CellStatus = "enemy" | "none" | "friend";

export default class Move {
	public from: number;
	public to: number;
	constructor(from: number, to: number) {
		this.from = from;
		this.to = to;
	}

	/**
	 * The middleware of the move generation.
	 * @param  - move - the move to be inserted
	 * @returns - true if the move is in the {insertIf} array
	 */
	static insertMiddleware({
		move,
		moves,
		insertIf = ["enemy", "none"],
	}: {
		move: Move;
		moves: number[];
		insertIf?: CellStatus[];
	}): boolean {
		const piece = board.square[move.from];
		const pieceTo = board.square[move.to];
		const color = piece.getColor();
		const colorTo = pieceTo.getColor();
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
		let result = board.move(this, true);
		board.undoMove();
		return !result;
	}

	// get all possible moves
	static generateAvailableLegalMoves(from: number): number[] {
		const result: number[] = [];

		// generate move using `generateAvailableMoves` function and insert it into `result` array and then filter it so all moves that are not legal are removed
		const moves = Move.generateAvailableMoves(from);
		for (let i = 0; i < moves.length; i++) {
			let move = new Move(from, moves[i]);
			if (move.isLegal()) {
				result.push(moves[i]);
			}
		}
		return result;
	}

	/**
	 * Generate all possible moves for the current player
	 * @returns - true if no move is available (checkmate)
	 */
	static generateMoves() {
		let checkMate = true;
		/* Generating all the possible moves for the current player. */
		for (let i = 0; i < 64; i++) {
			const piece = board.square[i];
			/* Skip if the color is not the color of the current player */
			if (
				piece.getColor() == Piece.none ||
				piece.getColor() != board.colorToMove
			) {
				continue;
			}
			const moves = Move.generateAvailableLegalMoves(i);
			/* If all the pieces cannot move, then it is checkmate */
			if (checkMate) {
				checkMate = moves.length == 0;
			}
			board.availableMoves[i] = moves;
		}
		return checkMate;
	}

	static generateAvailableMoves(from: number): number[] {
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

	/**
	 * The function returns an array of possible moves for a pawn
	 * @param {number} from - The index of the piece that is moving.
	 * @returns Available moves for the pawn (indexes of the squares)
	 */
	static pawnMove(from: number): number[] {
		let result: number[] = [];
		/* Up if the pawn is white */
		let offset =
			board.square[from].getColor() ==
			(board.playAsWhite ? Piece.white : Piece.black)
				? -8
				: 8;
		/* Final index */
		let index = from + offset;

		let [, y] = getCoords(from);

		/* Insert move forward if the square is empty */
		if (
			Move.insertMiddleware({
				move: new Move(from, index),
				moves: result,
				insertIf: ["none"],
			})
		) {
			/* If the pawn never moved, it can move two squares */
			if (y == (offset == 8 ? 1 : 6)) {
				Move.insertMiddleware({
					move: new Move(from, index + offset),
					moves: result,
					insertIf: ["none"],
				});
			}
		}

		/* Checking if the index is not on the left side of the board. */
		if (index % 8 != 0) {
			/* Pawn can capture diagonally to the left.*/
			Move.insertMiddleware({
				move: new Move(from, index - 1),
				moves: result,
				insertIf: ["enemy"],
			});
			// TODO: enpassant
		}

		/* 
        Checking if the index is not on the right side of the board. 
        Note: 0 mod 8 = 0
        */
		if ((index - 7) % 8 != 0) {
			/* Pawn can capture diagonally to the right.*/
			Move.insertMiddleware({
				move: new Move(from, index + 1),
				moves: result,
				insertIf: ["enemy"],
			});
			// TODO: enpassant
		}

		return result;
	}

	/**
	 * @param index - index of the piece
	 * @returns - true if the piece was attacked
	 */
	static isAttacked(index: number): boolean {
		/* Checking if the piece type is not none. */
		if (board.square[index].getType() == 0) return false;
		/* Enemy's color */
		let color = Piece.invertColor(board.square[index].getColor());

		let moveFuncs = [
			Move.alignAxisMove,
			Move.diagonalAxisMove,
			Move.kingMove,
			Move.knightMove,
		];
		let movePieces = [
			[color | Piece.rook, color | Piece.queen],
			[color | Piece.bishop, color | Piece.queen],
			[color | Piece.king],
			[color | Piece.knight],
		];

		for (let idx in moveFuncs) {
			let moves = moveFuncs[idx](index);
			let attacked = Piece.includesData(moves, ...movePieces[idx]);
			if (attacked) {
				return true;
			}
		}

		let offset =
			board.square[index].getColor() ==
			(board.playAsWhite ? Piece.white : Piece.black)
				? -8
				: 8;
		if (index + offset < 0 && index + offset >= 64) return false;
		if (index % 8 != 0) {
			let piece = board.square[index + offset + 1];
			if (piece.getType() == Piece.pawn && piece.getColor() == color) {
				// console.log("attacked by", index + offset - 1);
				return true;
			}
		}
		if ((index - 7) % 8 != 0) {
			let piece = board.square[index + offset + 1];
			if (piece.getType() == Piece.pawn && piece.getColor() == color) {
				// console.log("attacked by", index + offset + 1);
				return true;
			}
		}
		// console.log("isAttacked false");
		return false;
	}

	/**
	 * @param {number} from - The index of the piece you want to move
	 * @returns Available moves of the knight (indexes of the squares)
	 */
	static knightMove(from: number): number[] {
		let result: number[] = [];
		let [x, y] = getCoords(from);
		let range = [
			[-2, 2],
			[-1, 1],
		];
		/* Checking all the possible moves for the knight. */
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
					Move.insertMiddleware({
						move: new Move(from, index),
						moves: result,
					});
				}
			}
		}

		return result;
	}

	/**
	 * @param {number} from - the index of the piece you want to move
	 * @returns Available moves of the king (indexes of the squares)
	 */
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
			Move.insertMiddleware({ move: new Move(from, index), moves: result });
		}
		return result;
	}

	static alignAxisMove(from: number): number[] {
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
