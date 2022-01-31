"use strict";
function fillTypeRange(array, start, end, type) {
    for (let i = start; i <= end; i++) {
        array[i] = new Piece(i, type);
    }
}
function isUpperCase(source) {
    return source == source.toUpperCase();
}
function isLowerCase(source) {
    return source == source.toLowerCase();
}
function sleep(millisecondsDuration) {
    return new Promise((resolve) => {
        setTimeout(resolve, millisecondsDuration);
    });
}
