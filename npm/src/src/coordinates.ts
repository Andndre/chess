import { Piece } from './piece.js';
import { Vector } from './types.js';
import { Move } from './move.js';

/**
 * Given an index, return the x and y coordinates of the index in a chess board.
 * @param {number} index - The index of the square you want to get the coordinates of.
 * @returns An array of two numbers.
 */
export function getCoords(index: number): Vector {
	const x = index % 8;
	const y = Math.floor(index / 8);
	return {
		x,
		y,
	};
}

/**
 * Given an x and y coordinate, return the index of the corresponding cell in the board array.
 * @param {number} x - The x coordinate of the tile.
 * @param {number} y - The y coordinate of the tile.
 * @returns The index of the array.
 */
export function getIndex(x: number, y: number): number {
	return y * 8 + x;
}

/**
 * convert `a8` to 0, `b8` to 1, etc
 */
export function getIndexFromChessNotation(notation: string) {
	const ranks = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
	const files = ['8', '7', '6', '5', '4', '3', '2', '1'];
	return getIndex(
		ranks.indexOf(notation.charAt(0)),
		files.indexOf(notation.charAt(1))
	);
}

export function getChessNotationFromIndex(index: number) {
	const ranks = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
	const files = ['8', '7', '6', '5', '4', '3', '2', '1'];
	const { x, y } = getCoords(index);
	return ranks[x] + files[y];
}

export function getChessNotationFromMove(move: Move) {
	let capture = '';
	if (move.capture) {
		capture = new Piece(-1, move.capture.type | move.capture.color).toString();
	}
	return (
		getChessNotationFromIndex(move.from.index) +
		getChessNotationFromIndex(move.to.index) +
		capture
	);
}
