export declare function isUpperCase(str: string): boolean;
/**
 * Sleep() returns a Promise that resolves after the specified number of milliseconds.
 * @param {number} millisecondsDuration - The number of milliseconds to wait before resolving the
 * promise.
 * @returns A promise that resolves after a certain amount of time.
 */
export declare function sleep(millisecondsDuration: number): Promise<unknown>;
export declare function repeat(string: string, multiplier: number): string;
export declare function randomFromArray<T>(array: T[]): T;
export declare function lastElementInAnArray<T>(array: T[]): T;
