function getCoords(index: number): number[] {
	let x = index % 8;
	let y = Math.floor(index / 8);
	return [x, y];
}

function getIndex(x: number, y: number): number {
	return y * 8 + x;
}

function getMousePos(ev: MouseEvent): number[] {
	var rect = canvas.getBoundingClientRect();
	return [ev.clientX - rect.left, ev.clientY - rect.top];
}

function getClickedIndex(event: MouseEvent): number {
	let [x, y] = getMousePos(event);
	let boxScale = size / 8;
	let index = getIndex(Math.floor(x / boxScale), Math.floor(y / boxScale));
	return index;
}

function getClickedCoords(event: MouseEvent): number[] {
	let [file, rank] = getCoords(getClickedIndex(event));
	return [file, rank];
}
