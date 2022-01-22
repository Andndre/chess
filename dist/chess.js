"use strict";
class Chess {
    constructor(fenString) {
        this.board = [];
        this.currentPlayer = fenString[0] === fenString[0].toLowerCase() ? 'black' : 'white';
        let index = 0;
        for (let row of fenString.split('/')) {
            for (let char of row) {
                if (char in ['1', '2', '3', '4', '5', '6', '7', '8', '9']) {
                    index += Number.parseInt(char);
                    continue;
                }
                this.board[index] = char;
                index++;
            }
        }
    }
    getBoard() {
        return this.board;
    }
}
