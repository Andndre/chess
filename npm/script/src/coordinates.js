"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIndexFromChessNotation = exports.getIndex = exports.getCoords = void 0;
/**
 * Given an index, return the x and y coordinates of the index in a chess board.
 * @param {number} index - The index of the square you want to get the coordinates of.
 * @returns An array of two numbers.
 */
function getCoords(index) {
    const x = index % 8;
    const y = Math.floor(index / 8);
    return {
        x,
        y,
    };
}
exports.getCoords = getCoords;
/**
 * Given an x and y coordinate, return the index of the corresponding cell in the board array.
 * @param {number} x - The x coordinate of the tile.
 * @param {number} y - The y coordinate of the tile.
 * @returns The index of the array.
 */
function getIndex(x, y) {
    return y * 8 + x;
}
exports.getIndex = getIndex;
/**
 * convert `a8` to 0, `b8` to 1, etc
 */
function getIndexFromChessNotation(notation) {
    const x = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const y = ['8', '7', '6', '5', '4', '3', '2', '1'];
    return getIndex(x.indexOf(notation.charAt(0)), y.indexOf(notation.charAt(1)));
}
exports.getIndexFromChessNotation = getIndexFromChessNotation;
