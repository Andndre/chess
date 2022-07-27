export function isUpperCase(str: string) {
	return str == str.toUpperCase();
}

/**
 * Sleep() returns a Promise that resolves after the specified number of milliseconds.
 * @param {number} millisecondsDuration - The number of milliseconds to wait before resolving the
 * promise.
 * @returns A promise that resolves after a certain amount of time.
 */
export function sleep(millisecondsDuration: number) {
	return new Promise((resolve) => {
		setTimeout(resolve, millisecondsDuration);
	});
}

export function repeat(string: string, multiplier: number) {
	let res = '';
	for (let i = 0; i < multiplier; i++) {
		res += string;
	}
	return res;
}

export function randomFromArray<T>(array: T[]) {
	return array[Math.floor(Math.random() * array.length)];
}

export function lastElementInAnArray<T>(array: T[]) {
	if (!array.length) return undefined;
	return array[array.length - 1];
}
