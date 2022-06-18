import Renderer from "./renderer.js";
import Board from "./board.js";

export const canvas = document.getElementById("canvas") as HTMLCanvasElement;
export const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
export const scale = window.devicePixelRatio;
export const renderer = Renderer.get();
export const board = Board.get();

let size: number;
export const setSize = (newSize: number) => {
	size = newSize;
	return size;
};
export const getSize = () => size;

let scaledSize: number;
export const setScaledSize = (newScaledSize: number) => {
	scaledSize = newScaledSize;
	return scaledSize;
};
export const getScaledSize = () => scaledSize;
