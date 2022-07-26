"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lastElementInAnArray = exports.randomFromArray = exports.repeat = exports.sleep = exports.isUpperCase = void 0;
function isUpperCase(str) {
    return str == str.toUpperCase();
}
exports.isUpperCase = isUpperCase;
/**
 * Sleep() returns a Promise that resolves after the specified number of milliseconds.
 * @param {number} millisecondsDuration - The number of milliseconds to wait before resolving the
 * promise.
 * @returns A promise that resolves after a certain amount of time.
 */
function sleep(millisecondsDuration) {
    return new Promise((resolve) => {
        setTimeout(resolve, millisecondsDuration);
    });
}
exports.sleep = sleep;
function repeat(string, multiplier) {
    let res = '';
    for (let i = 0; i < multiplier; i++) {
        res += string;
    }
    return res;
}
exports.repeat = repeat;
function randomFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
}
exports.randomFromArray = randomFromArray;
function lastElementInAnArray(array) {
    return array[array.length - 1];
}
exports.lastElementInAnArray = lastElementInAnArray;
