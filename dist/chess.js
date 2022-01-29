"use strict";
class Chess {
    constructor(fenString) {
        this.board = [];
        this.availableMoves = [];
        this.firstPlayer = isLowerCase(fenString[0]) ? Piece.white : Piece.black;
        this.currentPlayer = this.firstPlayer;
        applyFen(this.board, fenString);
    }
    move(move) {
        let prevCheck = this.check;
        let tmp = this.board[move.to];
        this.board[move.to] = this.board[move.from];
        this.board[move.from] = Piece.none;
        this.check = undefined;
        Move.generateAvailableMoves(this.board[move.to], move.to);
        this.currentPlayer = Piece.invertColor(this.currentPlayer);
        for (let i = 0; i < 64; i++) {
            if (this.isFriend(i)) {
                Move.generateAvailableMoves(this.board[i], i);
            }
        }
        if (this.check != undefined && prevCheck != undefined) {
            this.board[move.from] = this.board[move.to];
            this.board[move.to] = tmp;
            this.check = prevCheck;
            this.currentPlayer = Piece.invertColor(this.currentPlayer);
        }
    }
    clicked(index) {
        if (this.selectedIndex == index)
            return false;
        // select
        if (this.board[index]
            && this.isFriend(index)) {
            this.selectedIndex = index;
            this.availableMoves = Move.generateAvailableMoves(this.board[index], index);
        }
        if (Move.includesTo(this.availableMoves, index)) {
            this.move(new Move(this.selectedIndex, index));
            this.selectedIndex = undefined;
            this.availableMoves = [];
        }
        return true;
    }
    isEnemy(index) {
        if (this.board[index] == Piece.none)
            return false;
        return !Piece.isColor(this.board[index], this.currentPlayer);
    }
    isFriend(index) {
        if (this.board[index] == Piece.none)
            return false;
        return Piece.isColor(this.board[index], this.currentPlayer);
    }
}
