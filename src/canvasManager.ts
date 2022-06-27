import { log } from "./utils.js";

/**
 * This class fixes blurry problems on some devices that have a pixel ratio greater than 1.
 *
 * How it works:
 *  - Scale up the canvas resolution by the device pixel ratio (canvas size times device pixel ratio).
 *  - Then scale it down using CSS properties (width and height).
 */
export class CanvasManager {
	#scale: number;
	#canvas: HTMLCanvasElement;
	#context: CanvasRenderingContext2D;
	constructor(canvas: HTMLCanvasElement) {
		log(1, "creating CanvasManager");
		this.#canvas = canvas;
		this.#scale = window.devicePixelRatio;
		this.#context = canvas.getContext("2d") as CanvasRenderingContext2D;
		log(-1, "");
	}

	getScale() {
		return this.#scale;
	}

	getCanvas() {
		return this.#canvas;
	}

	getContext() {
		return this.#context;
	}

	/**
	 * Set the width of the canvas to the given width
	 */
	setWidth(width: number) {
		log(1, "setting width ", width);
		this.#canvas.width = width * this.#scale;
		this.#canvas.style.width = `${width}px`;
		log(-1, "");
	}

	/**
	 * Set the height of the canvas to the given height
	 */
	setHeight(height: number) {
		log(1, "setting height ", height);
		this.#canvas.height = height * this.#scale;
		this.#canvas.style.height = `${height}px`;
		log(-1, "");
	}
}
