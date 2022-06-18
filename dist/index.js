import { getClickedIndex } from "./coordinates.js";
import { canvas, renderer, setScaledSize, setSize, scale, board, } from "./globals.js";
import { sleep } from "./utils.js";
let param = new URLSearchParams(window.location.search);
let fen = param.get("fen") ||
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
let reload = param.get("fen") == null || param.get("flip") == null;
export const flip = (param.get("flip") || "1") == "1";
/* Reloading the page with the new parameters. */
if (reload) {
    window.location.search = new URLSearchParams({
        fen: fen,
        flip: flip ? "1" : "0",
    }).toString();
}
window.onload = () => {
    board.loadFenPositions(fen);
    onResize();
    window.addEventListener("resize", onResize);
    canvas.addEventListener("click", async (event) => {
        let index = getClickedIndex(event);
        board.select(index);
        renderer.drawBoard();
        // without this the alert will pause the game before the canvas gets updated
        await sleep(10);
        if (board.checkMate) {
            alert("Checkmate!");
        }
    });
    /* Adding an event listener to the document for when the fullscreen changes. */
    ["", "webkit", "moz", "ms"].forEach((prefix) => document.addEventListener(prefix + "fullscreenchange", onResize, false));
};
/**
 * Its called when the window is resized.
 */
function onResize() {
    let size = setSize(window.innerWidth > window.innerHeight
        ? window.innerHeight
        : window.innerWidth);
    let scaledSize = setScaledSize(Math.floor(size * scale));
    canvas.width = scaledSize;
    canvas.height = scaledSize;
    renderer.drawBoard();
}
