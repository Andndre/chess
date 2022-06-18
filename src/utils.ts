import Piece from "./piece.js";

/**
 * Fill a range of indices in an array with a Piece
 * @param {Piece[]} array - The array to fill
 * @param {number} start - The index of the first element in the array to be filled.
 * @param {number} end - number: The last index of the array to fill.
 * @param {number} type - number
 */
export function fillTypeRange(
	array: Piece[],
	start: number,
	end: number,
	type: number
): void {
	for (let i = start; i <= end; i++) {
		array[i] = new Piece(i, type);
	}
}

/**
 * If the source string is the same as the source string converted to uppercase, then the source string
 * is uppercase.
 * @param {string} source - The string to check.
 * @returns A function
 */
export function isUpperCase(source: string) {
	return source == source.toUpperCase();
}

/**
 * If the source string is equal to the source string converted to lower case, then the source string
 * is lower case.
 * @param {string} source - The string to check.
 * @returns A boolean value.
 */
export function isLowerCase(source: string) {
	return source == source.toLowerCase();
}

/**
 * Sleep() returns a Promise that resolves after the specified number of milliseconds.
 * @param {number} millisecondsDuration - The number of milliseconds to wait before resolving the
 * promise.
 * @returns A promise that resolves after a certain amount of time.
 */
export function sleep(millisecondsDuration: number) {
	return new Promise((resolve) => {
		setTimeout(resolve, millisecondsDuration);
	});
}

export function getRookIndex(pos: number) {
	switch (pos) {
		case 0:
			return 0;
		case 7:
			return 1;
		case 56:
			return 2;
		case 63:
			return 3;
		default:
			return -1;
	}
}
