import { ChessGame } from './chessGame.ts';
import { CallBackFunction } from './types.ts';

export class BasicTimer {
	seconds: number;
	paused = false;
	onTimeIsUp: CallBackFunction;
	constructor(seconds: number, onTimeIsUp: CallBackFunction) {
		this.seconds = seconds;
		this.onTimeIsUp = onTimeIsUp;
	}
	start() {
		if (!this.paused) return;
		this.paused = false;
		return new Promise<void>((resolve) => {
			const interval = setInterval(() => {
				if (this.paused || this.seconds === 0) {
					resolve();
					clearInterval(interval);
					if (this.seconds === 0) {
						this.onTimeIsUp();
					}
					return;
				}
				this.seconds--;
			}, 1000);
		});
	}

	pause() {
		this.paused = true;
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
		onTimeIsUp?: CallBackFunction
	) {
		this.timers = {
			white: new BasicTimer(seconds, () => {
				chessGame.gameOver = true;
				chessGame.gameOverReason = 'draw';
				chessGame.onGameOver && chessGame.onGameOver();
				onTimeIsUp && onTimeIsUp();
			}),
			black: new BasicTimer(seconds, () => {
				chessGame.gameOver = true;
				chessGame.gameOverReason = 'draw';
				chessGame.onGameOver && chessGame.onGameOver();
				onTimeIsUp && onTimeIsUp();
			}),
		};
		this.chessGame = chessGame;
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
