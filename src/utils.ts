function fillTypeRange(
	array: Piece[],
	start: number,
	end: number,
	type: number
): void {
	for (let i = start; i <= end; i++) {
		array[i] = new Piece(i, type);
	}
}

function isUpperCase(source: string) {
	return source == source.toUpperCase();
}

function isLowerCase(source: string) {
	return source == source.toLowerCase();
}

function sleep(millisecondsDuration: number) {
	return new Promise((resolve) => {
		setTimeout(resolve, millisecondsDuration);
	});
}
