import { CanvasManager } from "./canvasManager.js";
import { Vector } from "./types.js";

/**
 * Given an index, return the x and y coordinates of the index in a chess board.
 * @param {number} index - The index of the square you want to get the coordinates of.
 * @returns An array of two numbers.
 */
export function getCoords(index: number): Vector {
	let x = index % 8;
	let y = Math.floor(index / 8);
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
 * Get the mouse position relative to the canvas, and return it as an array of two numbers [x,y].
 * @param {MouseEvent} ev - MouseEvent.
 * @param {HTMLCanvasElement} canvas
 * @returns An array of two numbers.
 */
export function getMousePos(ev: MouseEvent, canvas: HTMLCanvasElement): Vector {
	var rect = canvas.getBoundingClientRect();
	return { x: ev.clientX - rect.left, y: ev.clientY - rect.top };
}

/**
 * Get the index of the square the mouse is over.
 * @param event - MouseEvent.
 * @returns
 */
export function getClickedIndex(
	event: MouseEvent,
	canvasManager: CanvasManager
): number {
	let { x, y } = getMousePos(event, canvasManager.getCanvas());
	let squareScale = canvasManager.getCanvas().width / 8;
	let index = getIndex(
		Math.floor(x / squareScale),
		Math.floor(y / squareScale)
	);
	return index;
}

/**
 * Get the coordinates of the square the mouse is over.
 * @param {MouseEvent} event - MouseEvent
 * @returns An array of two numbers.
 */
export function getClickedCoords(
	event: MouseEvent,
	canvasManager: CanvasManager
): Vector {
	let coords = getCoords(getClickedIndex(event, canvasManager));
	return coords;
}
