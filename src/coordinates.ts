import { Vector } from './types.ts';

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
