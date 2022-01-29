"use strict";
// this class is used to represent a chess board and its pieces.
class Chess {
    // fen string is a string representing the board in Forsyth-Edwards Notation (FEN)
    constructor(fenString) {
        this.board = [];
        this.kingsPos = [];
        this.availableMoves = [];
        this.firstPlayer = isLowerCase(fenString[0]) ? Piece.white : Piece.black;
        this.currentPlayer = this.firstPlayer;
        // parse the fen string
        applyFen(this.board, fenString, this.kingsPos);
    }
    // update the board according to the move
    move(move) {
        let prevCheck = this.check;
        let cancelMove = false;
        let tmp = this.board[move.to];
        this.board[move.to] = this.board[move.from];
        this.board[move.from] = Piece.none;
        this.check = undefined;
        let res = Move.generateAvailableMoves(this.board[move.to], move.to);
        let inc = Move.includesEnemyKing(res, this.board, this.kingsPos, Piece.invertColor(this.currentPlayer));
        if (inc != undefined) {
            this.check = inc;
        }
        // enemy responses
        this.currentPlayer = Piece.invertColor(this.currentPlayer);
        for (let i = 0; i < 64; i++) {
            // if `i` has the same color as the current player
            if (this.isFriend(i)) {
                // generate available moves
                res = Move.generateAvailableMoves(this.board[i], i);
                // if the king is in check
                inc = Move.includesEnemyKing(res, this.board, this.kingsPos, Piece.invertColor(this.currentPlayer));
                // there is an enemy king
                if (inc != undefined) {
                    this.check = inc;
                    cancelMove = true;
                    console.log('cancel move');
                    break;
                }
            }
        }
        // restore
        if (cancelMove) {
            this.board[move.from] = this.board[move.to];
            this.board[move.to] = tmp;
            this.currentPlayer = Piece.invertColor(this.currentPlayer);
            this.check = prevCheck;
        }
    }
    // returns true if it needs to redraw
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
    // returns true if the piece has opposite color to the current player
    isEnemy(index) {
        if (this.board[index] == Piece.none)
            return false;
        return !Piece.isColor(this.board[index], this.currentPlayer);
    }
    // returns true if the piece has the same color as the current player
    isFriend(index) {
        if (this.board[index] == Piece.none)
            return false;
        return Piece.isColor(this.board[index], this.currentPlayer);
    }
}
