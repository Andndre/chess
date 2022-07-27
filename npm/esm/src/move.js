export class Move {
    constructor(board, fromIndex, toIndex, captureIndex, move, checkIndex) {
        Object.defineProperty(this, "from", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "to", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "capture", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "move", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "check", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        const t = board.tiles;
        this.from = {
            color: t[fromIndex].getColor(),
            type: t[fromIndex].getType(),
            index: fromIndex,
        };
        this.to = {
            color: t[toIndex].getColor(),
            type: t[toIndex].getType(),
            index: toIndex,
        };
        if (captureIndex) {
            const c = t[captureIndex];
            this.capture = {
                color: c.getColor(),
                type: c.getType(),
                index: captureIndex,
            };
        }
        if (move) {
            this.move = new Move(board, move.fromIndex, move.toIndex);
        }
        if (checkIndex) {
            this.check = checkIndex;
        }
    }
    isPromote() {
        return this.from.color !== this.to.color;
    }
}
