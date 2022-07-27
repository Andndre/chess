export function isUpperCase(str) {
    return str == str.toUpperCase();
}
/**
 * Sleep() returns a Promise that resolves after the specified number of milliseconds.
 * @param {number} millisecondsDuration - The number of milliseconds to wait before resolving the
 * promise.
 * @returns A promise that resolves after a certain amount of time.
 */
export function sleep(millisecondsDuration) {
    return new Promise((resolve) => {
        setTimeout(resolve, millisecondsDuration);
    });
}
export function repeat(string, multiplier) {
    let res = '';
    for (let i = 0; i < multiplier; i++) {
        res += string;
    }
    return res;
}
export function randomFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
}
export function lastElementInAnArray(array) {
    if (!array.length)
        return undefined;
    return array[array.length - 1];
}
