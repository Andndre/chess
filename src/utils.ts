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

function getRookIndex(pos: number) {
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
