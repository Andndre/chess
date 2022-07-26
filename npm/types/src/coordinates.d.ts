import { Vector } from './types.js';
/**
 * Given an index, return the x and y coordinates of the index in a chess board.
 * @param {number} index - The index of the square you want to get the coordinates of.
 * @returns An array of two numbers.
 */
export declare function getCoords(index: number): Vector;
/**
 * Given an x and y coordinate, return the index of the corresponding cell in the board array.
 * @param {number} x - The x coordinate of the tile.
 * @param {number} y - The y coordinate of the tile.
 * @returns The index of the array.
 */
export declare function getIndex(x: number, y: number): number;
/**
 * convert `a8` to 0, `b8` to 1, etc
 */
export declare function getIndexFromChessNotation(notation: string): number;
