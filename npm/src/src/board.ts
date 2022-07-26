import { Color, Piece, Type } from './piece.js';
import { lastElementInAnArray } from './utils.js';
import { getIndex } from './coordinates.js';
import { DOWN, NONE } from './constants.js';
import { Mover } from './mover.js';

export class Board {
	tiles: Piece[] = [];
	numToEdge: number[][] = [];
	checkMate = false;
	checkIndex = NONE;

	/**
	 * **IMPORTANT**
	 *
	 * Create `Mover` after creating this
	 */
	constructor() {
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
					empty = 0;
				}
				result += this.tiles[index].toString();
			}
			if (empty) {
				result += empty;
				empty = 0;
			}
			if (file !== 7) result += '/';
		}
		result += ' ';
		result += thisMover.current === Color.white ? 'w' : 'b';
		result += ' ';
		const beforeCastle = result.length;
		if (thisMover.K) result += 'K';
		if (thisMover.Q) result += 'Q';
		if (thisMover.k) result += 'k';
		if (thisMover.q) result += 'q';
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
		result += thisMover.halfMoveClock();
		result += ' ';
		result += thisMover.fullMoveNumber();

		return result;
	}

	toString() {
		let result = '';
		for (let file = 0; file < 8; file++) {
			for (let rank = 0; rank < 8; rank++) {
				const index = getIndex(rank, file);
				result += this.tiles[index].getChessSymbol();
				result += ' ';
			}
			result += '\n';
		}
		return result;
	}
}
