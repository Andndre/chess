import { ChessGame } from './chessGame.ts';
import { CallBackFunction } from './types.ts';

export class BasicTimer {
	seconds: number;
	paused = true;
	stopped = false;
	onTimeIsUp: CallBackFunction;
	onTick: CallBackFunction;
	constructor(
		seconds: number,
		onTimeIsUp: CallBackFunction,
		onTick: CallBackFunction
	) {
		this.seconds = seconds;
		this.onTimeIsUp = onTimeIsUp;
		this.onTick = onTick;
	}
	start() {
		if (this.stopped) return;
		if (!this.paused) return;
		this.paused = false;
		return new Promise<void>((resolve) => {
			const interval = setInterval(() => {
				if (this.paused || this.seconds === 0 || this.stopped) {
					resolve();
					clearInterval(interval);
					if (this.seconds === 0) {
						this.onTimeIsUp();
					}
					return;
				}
				this.seconds--;
				this.onTick();
			}, 1000);
		});
	}

	pause() {
		this.paused = true;
	}

	stop() {
		this.stopped = true;
	}
}

type ChessTimersStruct = {
	white: BasicTimer;
	black: BasicTimer;
};

export class ChessTimer {
	timers: ChessTimersStruct;
	chessGame: ChessGame;

	constructor(
		seconds: number,
		chessGame: ChessGame,
		onTimeIsUp?: CallBackFunction,
		onTick?: CallBackFunction
	) {
		this.timers = {
			white: new BasicTimer(
				seconds,
				() => {
					chessGame.gameOver = true;
					chessGame.gameOverReason = 'draw';
					for (const cb of this.chessGame.onGameOver) {
						cb();
					}
					onTimeIsUp && onTimeIsUp();
				},
				() => {
					onTick && onTick();
				}
			),
			black: new BasicTimer(
				seconds,
				() => {
					chessGame.gameOver = true;
					chessGame.gameOverReason = 'draw';
					for (const cb of this.chessGame.onGameOver) {
						cb();
					}
					onTimeIsUp && onTimeIsUp();
				},
				() => {
					onTick && onTick();
				}
			),
		};
		this.chessGame = chessGame;
		chessGame.on('gameOver', () => {
			this.timers.black.stop();
			this.timers.white.stop();
		});
		chessGame.on('move', () => {
			let startCount = 0;
			if (this.timers.black.paused) {
				startCount++;
				this.timers.black.start();
			} else {
				this.timers.black.pause();
			}
			if (this.timers.white.paused) {
				if (!startCount) this.timers.white.start();
			} else {
				this.timers.white.pause();
			}
		});
	}
}
