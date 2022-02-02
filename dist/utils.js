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
function getRookIndex(pos) {
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
