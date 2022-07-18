import { Color, Piece, Type } from './piece.ts';
import { isUpperCase, lastElementInAnArray } from './utils.ts';
import { getIndex } from './coordinates.ts';
import { DOWN, NONE } from './constants.ts';
import { Mover } from './mover.ts';

export class Board {
	tiles: Piece[] = [];
	numToEdge: number[][] = [];
	checkMate = false;
	checkIndex = NONE;
	/**
	 * If white is permitted to castle on the Queen's side
	 */
	Q = true;
	/**
	 * If black is permitted to castle on the Queen's side
	 */
	q = true;
	/**
	 * If white is permitted to castle on the King's side
	 */
	K = true;
	/**
	 * If black is permitted to castle on the King's side,
	 */
	k = true;

	private constructor() {
		for (let file = 0; file < 8; file++) {
			for (let rank = 0; rank < 8; rank++) {
				const up = 7 - rank;
				const down = rank;
				const left = file;
				const right = 7 - file;

				const squareIndex = getIndex(file, rank);

				// define the distance to the edge of the board for each direction for each square
				this.numToEdge[squareIndex] = [
					up,
					down,
					left,
					right,
					Math.min(up, left),
					Math.min(down, right),
					Math.min(up, right),
					Math.min(down, left),
				];
			}
		}
	}

	/**
	 *
	 * @param fen FEN notation
	 * @returns a new Board
	 */
	static fromFEN(fen: string) {
		const board = new Board();
		board.loadFenString(fen);
		return board;
	}

	private loadFenString(fen: string) {
		const fenComponents = fen.split(' ');
		const fenPositions = fenComponents[0].split('/');
		// load FEN positions
		// loop through each row
		let index = 0;
		for (const row of fenPositions) {
			// loop through each character in the row
			for (const char of row) {
				// if the character is a number, add that many blank squares to the board
				if (char.match(/[0-9]/)) {
					const num = Number.parseInt(char);
					// fill with none
					for (let i = index; i <= index + num; i++) {
						this.tiles[i] = new Piece(i, Type.none);
					}
					// skip
					index += num;
					continue;
				}
				// if the character is a letter, add that piece to the board
				const piece = new Piece(index, Piece.getTypeFromChar(char)!);
				// add the piece to the board
				this.tiles[index] = piece;
				const white = isUpperCase(char);
				// set the piece's colour
				this.tiles[index].code |= white ? Color.white : Color.black;
				index++;
			}
		}
	}

	getFenString(thisMover: Mover) {
		let result = '';
		for (let file = 0; file < 8; file++) {
			let empty = 0;
			for (let rank = 0; rank < 8; rank++) {
				const index = getIndex(rank, file);
				if (this.tiles[index].code === Type.none) {
					empty++;
					continue;
				}
				if (empty) {
					result += empty;
				}
				result += this.tiles[index].toString();
			}
			if (empty) {
				result += empty;
			}
			if (file !== 7) result += '/';
		}
		result += ' ';
		const beforeCastle = result.length;
		if (this.K) result += 'K';
		if (this.Q) result += 'Q';
		if (this.k) result += 'k';
		if (this.q) result += 'q';
		if (!(result.length - beforeCastle)) result += '-';
		result += ' ';
		const lastMove = lastElementInAnArray(thisMover.history);
		if (
			lastMove &&
			lastMove.from.type === Type.pawn &&
			Math.abs(lastMove.to.index - lastMove.from.index) === DOWN * 2
		) {
			const mid = (lastMove.from.index + lastMove.to.index) / 2;
			const y = 8 - Math.floor(mid / 8);
			const x = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][mid % 8];
			result += x + y;
		} else {
			result += '-';
		}
		result += ' ';
		result += thisMover.history.length;
		result += ' ';
		result += Math.floor(thisMover.history.length / 2) + 1;

		return result;
	}

	/**
	 
	 */
	toString() {}
}
