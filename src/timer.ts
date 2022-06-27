export class Timer {
	element: HTMLElement;
	seconds: number;
	paused = false;
	enemy: string;
	constructor(element: HTMLElement, seconds: number, enemy: string) {
		this.element = element;
		this.seconds = seconds;
		this.element.innerHTML = this.format();
		this.enemy = enemy;
	}
	start() {
		this.paused = false;
		return new Promise((resolve) => {
			const interval = setInterval(() => {
				if (this.paused || this.seconds === 0) {
					resolve("");
					clearInterval(interval);
					if (this.seconds === 0) {
						alert("Time is up.. " + this.enemy + " wins!");
					}
					return;
				}
				this.seconds--;
				this.element.innerHTML = this.format();
			}, 1000);
		});
	}

	pause() {
		this.paused = true;
	}

	twoDigit(num: number) {
		let res = num.toString();
		if (res.length === 1) res = `0${res}`;
		return res;
	}

	format() {
		return `${this.twoDigit(Math.floor(this.seconds / 3600))}:${this.twoDigit(
			Math.floor(this.seconds / 60) % 60
		)}:${this.twoDigit(this.seconds % 60)}`;
	}
}
