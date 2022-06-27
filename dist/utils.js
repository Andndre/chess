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
let indentLog = 0;
export function repeat(string, multiplier) {
    let res = "";
    for (let i = 0; i < multiplier; i++) {
        res += string;
    }
    return res;
}
export function log(indent, ...message) {
    // indentLog += indent;
    // console.log(repeat("|", indentLog), ...message);
}
