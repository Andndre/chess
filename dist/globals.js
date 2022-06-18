import Renderer from "./renderer.js";
import Board from "./board.js";
export const canvas = document.getElementById("canvas");
export const ctx = canvas.getContext("2d");
export const scale = window.devicePixelRatio;
export const renderer = Renderer.get();
export const board = Board.get();
let size;
export const setSize = (newSize) => {
    size = newSize;
    return size;
};
export const getSize = () => size;
let scaledSize;
export const setScaledSize = (newScaledSize) => {
    scaledSize = newScaledSize;
    return scaledSize;
};
export const getScaledSize = () => scaledSize;
