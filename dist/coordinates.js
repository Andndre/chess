"use strict";
function getCoords(index) {
    let x = index % 8;
    let y = Math.floor(index / 8);
    return [x, y];
}
function getIndex(x, y) {
    return y * 8 + x;
}
function getMousePos(ev) {
    var rect = canvas.getBoundingClientRect();
    return [ev.clientX - rect.left, ev.clientY - rect.top];
}
function getClickedIndex(event) {
    let [x, y] = getMousePos(event);
    let boxScale = size / 8;
    let index = getIndex(Math.floor(x / boxScale), Math.floor(y / boxScale));
    return index;
}
function getClickedCoords(event) {
    let [file, rank] = getCoords(getClickedIndex(event));
    return [file, rank];
}
