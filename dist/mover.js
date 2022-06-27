import { directionOffsets, DOWN, NONE, UP } from "./constants.js";
import { getCoords, getIndex } from "./coordinates.js";
import { Color, Piece, Type } from "./piece.js";
import { Timer } from "./timer.js";
import { log } from "./utils.js";
export class Mover {
    constructor(board) {
        this.current = Color.white;
        this.selectedIndex = NONE;
        this.history = [];
        this.checkIndex = {
            16: NONE,
            8: NONE,
        };
        this.legalMoves = [];
        this.checkMate = false;
        this.timers = {
            16: new Timer(document.getElementById("timer-p1"), 3600, "Black"),
            8: new Timer(document.getElementById("timer-p2"), 3600, "White"),
        };
        log(1, "creating Mover");
        this.board = board;
        this.generateNextMove();
        log(-1, "");
    }
    selectTile(index) {
        log(1, "selecting tile ", index);
        if (this.timers[16].seconds === 0 || this.timers[8].seconds === 0) {
            return;
        }
        const isFriendly = this.board.tiles[index].isColor(this.current);
        if (isFriendly) {
            log(1, "friend");
            this.selectedIndex = index;
            log(-1, "");
        }
        else if (this.selectedIndex != NONE &&
            !!this.legalMoves[this.selectedIndex].find((move) => move.to.index == index)) {
            log(1, "move");
            this.move(this.legalMoves[this.selectedIndex].find((move) => {
                return move.to.index == index;
            }));
            const current = Piece.invertColor(this.current);
            console.log(current);
            this.timers[current].pause();
            const enemy = Piece.invertColor(current);
            this.timers[enemy].start();
            this.checkIndex[16] = NONE;
            this.checkIndex[8] = NONE;
            const enemyColor = this.current;
            const enemyKingIndex = this.getKingIndex(enemyColor);
            const isCheck = this.isAttacked(enemyKingIndex);
            if (isCheck) {
                if (enemyColor !== Color.none) {
                    this.checkIndex[enemyColor] = enemyKingIndex;
                }
            }
            this.selectedIndex = NONE;
            this.generateNextMove();
            log(-1, "");
        }
        else {
            log(1, "cancel move");
            this.selectedIndex = NONE;
            log(-1, "");
        }
        log(-1, "");
    }
    move(move) {
        const from = this.board.tiles[move.from.index];
        const to = this.board.tiles[move.to.index];
        log(1, "move from ", from.index, " to ", to.index);
        from.moved++;
        if (!!move.capture) {
            this.board.tiles[move.capture.index].code = Type.none;
        }
        if (!!move.move) {
            const from_ = this.board.tiles[move.move.from.index];
            const to_ = this.board.tiles[move.move.to.index];
            to_.code = from_.code;
            from_.code = Type.none;
        }
        // promote
        let promote = false;
        if (from.isType(Type.pawn) &&
            getCoords(move.to.index).y === (from.isColor(Color.white) ? 0 : 7)) {
            // TODO: dropdown menu
            // await dropdown ?
            promote = true;
            to.code = Type.queen | from.getColor();
        }
        if (!promote)
            to.code = from.code;
        from.code = Type.none;
        this.current = this.current == Color.white ? Color.black : Color.white;
        this.history.push(move);
        log(-1, "");
    }
    /**
     * Restore the board to the state it was in before the last move in the history was made
     */
    undoMove() {
        const move = this.history.pop();
        if (!move)
            return;
        log(1, "undo move ", move.to, " back to ", move.from);
        const from = this.board.tiles[move.from.index];
        const to = this.board.tiles[move.to.index];
        from.moved--;
        if (!!move.capture) {
            this.board.tiles[move.capture.index].code =
                move.capture.color | move.capture.type;
        }
        if (!!move.move) {
            const from_ = this.board.tiles[move.move.from.index];
            const to_ = this.board.tiles[move.move.to.index];
            to_.code = move.move.to.color | move.move.to.type;
            from_.code = move.move.from.color | move.move.from.type;
        }
        to.code = move.to.color | move.to.type;
        from.code = move.from.color | move.from.type;
        this.current = this.current == Color.white ? Color.black : Color.white;
        log(-1, "");
    }
    /**
     * Fills the legal moves array with the legal moves for the current player
     */
    generateNextMove() {
        log(1, "clearing legal moves");
        this.legalMoves.splice(0, this.legalMoves.length);
        const { moves, checkMate } = this.generateMoves(this.current);
        this.checkMate = checkMate;
        this.legalMoves.push(...moves);
        log(-1, "");
    }
    /**
     * @param {Color} color - The color of the player whose moves are being generated.
     * @returns An array of arrays of moves.
     */
    generateMoves(color) {
        log(1, "generating moves", color);
        const moves = [];
        const kingIndex = this.getKingIndex(color);
        let checkMate = true;
        // Generate moves
        for (let i = 0; i < 64; i++) {
            if (this.board.tiles[i].isColor(color)) {
                moves[i] = this.getLegalMoves(i, kingIndex);
                if (checkMate) {
                    checkMate = moves[i].length === 0;
                }
                continue;
            }
            moves[i] = [];
        }
        log(-1, "");
        return { moves, checkMate };
    }
    /**
     * @param {Move} move - Move - The move to check
     * @returns A boolean value.
     */
    isLegal(move, kingIndex) {
        if (move.to.color === move.from.color) {
            return false;
        }
        if (move.from.type === Type.king) {
            kingIndex = move.to.index;
        }
        this.move(move);
        const isAttacked = this.isAttacked(kingIndex);
        this.undoMove();
        return !isAttacked;
    }
    /**
     * It returns all the legal moves from a given square
     * @param {number} from - the square from which you want to get the legal moves
     * @returns An array of moves that are legal.
     */
    getLegalMoves(from, kingIndex) {
        log(1, "getting legal moves from ", from);
        let moves = this.getLegalAndIllegalMoves(from);
        moves = moves.filter((move) => {
            const isLegal = this.isLegal(move, kingIndex);
            return isLegal;
        });
        log(-1, "");
        return moves;
    }
    /**
     * It returns all the legal and non-legal moves for a given piece
     * @param {number} from - the tile number of the piece you want to move
     * @returns An array of moves.
     */
    getLegalAndIllegalMoves(from) {
        log(1, "getting all legal and non-legal moves from ", from);
        let result = [];
        let piece = this.board.tiles[from];
        // const white = Piece.isColor(piece.code, Color.white);
        // RNBQKBNR
        // ROOKS //
        if (piece.getType() === Type.rook) {
            log(1, "rook");
            result.push(...this.alignAxisMove(from));
            log(-1, "");
        }
        // KNIGHTS //
        else if (piece.getType() == Type.knight) {
            log(1, "knights");
            result.push(...this.knightMove(from));
            log(-1, "");
        }
        // BISHOPS //
        else if (piece.getType() == Type.bishop) {
            log(1, "bishops");
            result.push(...this.diagonalAxisMove(from));
            log(-1, "");
        }
        // QUEEN //
        else if (piece.getType() == Type.queen) {
            log(1, "queen");
            result.push(...this.alignAxisMove(from));
            result.push(...this.diagonalAxisMove(from));
            log(-1, "");
        }
        // KING //
        else if (piece.getType() == Type.king) {
            log(1, "king");
            const kingMove = this.kingMove(from);
            result.push(...kingMove);
            log(-1, "");
        }
        // PAWNS //
        else if (piece.getType() == Type.pawn) {
            log(1, "pawns");
            result.push(...this.pawnMove(from));
            log(-1, "");
        }
        log(-1, "");
        return result;
    }
    /**
     * The middleware of the move generation.
     * @param  - move - the move to be inserted
     * @returns - true if the move is in the {insertIf} array
     */
    insertIf({ move, moves, insertIf = ["enemy", "none"], }) {
        log(1, "inserting move ", move, " if ", insertIf);
        const piece = this.board.tiles[move.from.index];
        const pieceTo = this.board.tiles[move.to.index];
        const color = piece.getColor();
        const colorTo = pieceTo.getColor();
        log(-1, "");
        if (Piece.invertColor(color) == colorTo) {
            if (insertIf.indexOf("enemy") != NONE) {
                moves.push(move);
                return true;
            }
            return false;
        }
        if (colorTo == Color.none) {
            if (insertIf.indexOf("none") != NONE) {
                moves.push(move);
                return true;
            }
            return false;
        }
        if (insertIf.indexOf("friend") != NONE) {
            moves.push(move);
            return true;
        }
        return false;
    }
    getMove(fromIndex, toIndex, options) {
        log(1, "getting move from: ", fromIndex, " to: ", toIndex);
        log(-1, "");
        return {
            from: {
                index: fromIndex,
                type: this.board.tiles[fromIndex].getType(),
                color: this.board.tiles[fromIndex].getColor(),
            },
            to: {
                index: toIndex,
                type: this.board.tiles[toIndex].getType(),
                color: this.board.tiles[toIndex].getColor(),
            },
            capture: !!(options === null || options === void 0 ? void 0 : options.capture)
                ? {
                    index: options === null || options === void 0 ? void 0 : options.capture,
                    type: this.board.tiles[options === null || options === void 0 ? void 0 : options.capture].getType(),
                    color: this.board.tiles[options === null || options === void 0 ? void 0 : options.capture].getColor(),
                }
                : undefined,
            move: !!(options === null || options === void 0 ? void 0 : options.move) ? options.move : undefined,
        };
    }
    /**
     * The function returns an array of possible moves for a pawn
     * @param {number} from - The index of the piece that is moving.
     * @returns Available moves for the pawn (indexes of the squares)
     */
    pawnMove(from) {
        log(1, "pawnColor:", this.board.tiles[from].getColor());
        const result = [];
        /* Up if the pawn is white */
        const offset = this.board.tiles[from].getColor() == Color.white ? UP : DOWN;
        /* Final index */
        const index = from + offset;
        const { y } = getCoords(from);
        /* Insert move forward if the square is empty */
        if (this.insertIf({
            move: this.getMove(from, index),
            moves: result,
            insertIf: ["none"],
        })) {
            /* If the pawn never moved, it can move two squares */
            if (y === (offset == DOWN ? 1 : 6)) {
                this.insertIf({
                    move: this.getMove(from, index + offset),
                    moves: result,
                    insertIf: ["none"],
                });
            }
        }
        /* Checking if the index is not on the left side of the board. */
        if (index % 8 != 0) {
            /* Pawn can capture diagonally to the left.*/
            this.insertIf({
                move: this.getMove(from, index - 1),
                moves: result,
                insertIf: ["enemy"],
            });
            // enpassant
            const lastMove = this.history[this.history.length - 1];
            if (lastMove &&
                lastMove.from.type === Type.pawn &&
                lastMove.to.index === from - 1 &&
                Math.abs(lastMove.to.index - lastMove.from.index) === DOWN * 2) {
                log(1, "enpassant");
                result.push(this.getMove(from, from + offset - 1, { capture: from - 1 }));
                log(-1, "");
            }
        }
        /*
        Checking if the index is not on the right side of the board.
        Note: 0 mod 8 = 0
        */
        if ((index - 7) % 8 != 0) {
            /* Pawn can capture diagonally to the right.*/
            this.insertIf({
                move: this.getMove(from, index + 1),
                moves: result,
                insertIf: ["enemy"],
            });
            // enpassant
            const lastMove = this.history[this.history.length - 1];
            if (lastMove &&
                lastMove.from.type === Type.pawn &&
                lastMove.to.index === from + 1 &&
                Math.abs(lastMove.to.index - lastMove.from.index) === DOWN * 2) {
                log(1, "enpassant");
                result.push(this.getMove(from, from + offset + 1, { capture: from + 1 }));
                log(-1, "");
            }
        }
        log(-1, "");
        return result;
    }
    /**
     * @param index - index of the piece
     * @returns - true if the piece was attacked
     */
    isAttacked(index) {
        log(1, "isAttacked: ", index);
        /* Checking if the piece type is not none. */
        if (this.board.tiles[index].getType() == 0)
            return false;
        /* Enemy's color */
        const color = Piece.invertColor(this.board.tiles[index].getColor());
        const moveFuncs = [
            this.alignAxisMove,
            this.diagonalAxisMove,
            this.kingMove,
            this.knightMove,
        ];
        const movePieces = [
            [Type.rook | color, Type.queen | color],
            [Type.bishop | color, Type.queen | color],
            [Type.king | color],
            [Type.knight | color],
        ];
        for (let idx in moveFuncs) {
            const moves = moveFuncs[idx](index, this);
            const attacked = !!moves.find((move) => {
                return !!movePieces[idx].find((code) => {
                    return code == (move.to.color | move.to.type);
                });
            });
            if (attacked) {
                log(-1, true);
                return true;
            }
        }
        const offset = this.board.tiles[index].isColor(Color.white) ? UP : DOWN;
        if (index + offset < 0 && index + offset >= 64)
            return false;
        if (index % 8 != 0) {
            const piece = this.board.tiles[index + offset - 1];
            if (piece.code === (color | Type.pawn)) {
                log(-1, true);
                return true;
            }
        }
        if ((index - 7) % 8 != 0) {
            const piece = this.board.tiles[index + offset + 1];
            if (piece.code === (color | Type.pawn)) {
                log(-1, true);
                return true;
            }
        }
        log(-1, false);
        return false;
    }
    /**
     * @param from - The index of the piece you want to move
     * @returns Available moves of the knight (indexes of the squares)
     */
    knightMove(from, obj = this) {
        const result = [];
        const { x, y } = getCoords(from);
        const range = [
            [-2, 2],
            [-1, 1],
        ];
        /* Checking all the possible moves for the knight. */
        for (let i = 0; i < 2; i++) {
            for (let xOffset of range[i]) {
                for (let yOffset of range[1 - i]) {
                    if (x + xOffset < 0 ||
                        x + xOffset > 7 ||
                        y + yOffset < 0 ||
                        y + yOffset > 7)
                        continue;
                    let index = getIndex(x + xOffset, y + yOffset);
                    obj.insertIf({
                        move: obj.getMove(from, index),
                        moves: result,
                    });
                }
            }
        }
        return result;
    }
    getKingIndex(color) {
        return this.board.tiles.find((piece) => piece.isColor(color) && piece.isType(Type.king)).index;
    }
    /**
     * @param {number} from - the index of the piece you want to move
     * @returns Available moves of the king (indexes of the squares)
     */
    kingMove(from, obj = this) {
        const result = [];
        const range = [
            [-1, 1],
            [-1, 0],
            [-1, -1],
            [0, -1],
            [1, -1],
            [1, 0],
            [1, 1],
            [0, 1],
        ];
        const { x, y } = getCoords(from);
        for (let i = 0; i < 8; i++) {
            const xOffset = range[i][0];
            const yOffset = range[i][1];
            const xFinal = x + xOffset;
            const yFinal = y + yOffset;
            if (xFinal < 0 || xFinal > 7 || yFinal < 0 || yFinal > 7)
                continue;
            const index = getIndex(xFinal, yFinal);
            obj.insertIf({ move: obj.getMove(from, index), moves: result });
        }
        const color = obj.board.tiles[from].getColor();
        if (color == Color.none)
            return result;
        const kingIndex = color === Color.white ? 60 : 4;
        const currentKingIndex = obj.getKingIndex(color);
        // castle
        if (kingIndex !== from || !!obj.board.tiles[kingIndex].moved)
            return result;
        if (obj.checkIndex[color] !== NONE)
            return result;
        // left
        if (!obj.board.tiles[kingIndex - 4].moved) {
            let allowedToCastle = true;
            for (let i = 1; i < 4; i++) {
                if (!obj.isLegal(obj.getMove(kingIndex, kingIndex - i), currentKingIndex)) {
                    allowedToCastle = false;
                    break;
                }
            }
            if (allowedToCastle) {
                result.push(obj.getMove(kingIndex, kingIndex - 2, {
                    move: obj.getMove(kingIndex - 4, kingIndex - 1),
                }));
            }
        }
        // right
        if (!obj.board.tiles[kingIndex + 3].moved) {
            let allowedToCastle = true;
            for (let i = 1; i < 3; i++) {
                if (!obj.isLegal(obj.getMove(kingIndex, kingIndex + i), currentKingIndex)) {
                    allowedToCastle = false;
                    break;
                }
            }
            if (allowedToCastle) {
                result.push(obj.getMove(kingIndex, kingIndex + 2, {
                    move: obj.getMove(kingIndex + 3, kingIndex + 1),
                }));
            }
        }
        return result;
    }
    /**
     * It returns an array of all the moves that a piece can make in a straight line
     * @param {number} from - The index of the piece you want to move.
     * @returns An array of moves.
     */
    alignAxisMove(from, obj = this) {
        const piece = obj.board.tiles[from];
        const colorToMove = piece.getColor();
        const moves = [];
        for (let i = 0; i < 4; i++) {
            let current = from;
            const dirrection = directionOffsets[i];
            for (let j = 0; j < obj.board.numToEdge[from][i]; j++) {
                current += dirrection;
                const color = obj.board.tiles[current].getColor();
                if (color == Color.none || color == Piece.invertColor(colorToMove))
                    moves.push(obj.getMove(from, current));
                if (color == colorToMove || color == Piece.invertColor(colorToMove))
                    break;
            }
        }
        return moves;
    }
    /**
     * It returns an array of all the moves that a piece can make in a diagonal direction
     * @param {number} from - the index of the piece you want to move
     * @returns An array of moves.
     */
    diagonalAxisMove(from, obj = this) {
        const piece = obj.board.tiles[from];
        const colorToMove = piece.getColor();
        const moves = [];
        for (let i = 4; i < 9; i++) {
            let current = from;
            const dirrection = directionOffsets[i];
            for (let j = 0; j < obj.board.numToEdge[from][i]; j++) {
                current += dirrection;
                const color = obj.board.tiles[current].getColor();
                if (color == Color.none || color == Piece.invertColor(colorToMove)) {
                    moves.push(obj.getMove(from, current));
                }
                if (color == colorToMove || color == Piece.invertColor(colorToMove)) {
                    break;
                }
            }
        }
        return moves;
    }
}
