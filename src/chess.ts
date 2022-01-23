type Piece = 'r' | 'n' | 'b' | 'q' | 'k' | 'p' | 'R' | 'N' | 'B' | 'Q' | 'K' | 'P';
type Player = 'white' | 'black';
type MoveStatus = 'enemy' | 'empty' | 'friend';
interface Move{
  from: number,
  to: number
}

class Chess{
  public board: Piece[] | undefined[];
  public currentPlayer: Player;
  public selectedIndex?: number;
  public firstPlayer: Player;
  public availableMoves: number[];
  constructor(fenString: string){
    this.board = [];
    this.availableMoves = [];
    this.firstPlayer = fenString[0] === fenString[0].toLowerCase() ? 'white' : 'black';
    this.currentPlayer = this.firstPlayer;
    let index = 0;
    for(let row of fenString.split('/')){
      for(let char of row){
        if(['1', '2', '3', '4', '5', '6', '7', '8', '9'].indexOf(char) != -1){
          index += Number.parseInt(char);
          continue;
        }
        this.board[index] = char as Piece;
        index++;
      }
    }
  }
  move(move: Move){
    this.board[move.to] = this.board[move.from];
    this.board[move.from] = undefined;
  }

  clicked(index: number): boolean{
    if(this.selectedIndex == index) return false;
    // select
    if(this.board[index] 
      && this.isFriend(index)){
        this.selectedIndex = index;
      this.availableMoves = this.generateAvailableMoves(this.board[index]!, index);
    }
    if(this.availableMoves.indexOf(index) != -1){
      this.move(
        {
          from: this.selectedIndex!, 
          to: index
        }
      );
      this.selectedIndex = undefined;
      this.availableMoves = [];
      this.currentPlayer = this.currentPlayer == 'black' ? 'white' : 'black';
    }
    return true;
  }
  insertAvMoves(index: number, result: number[]) : MoveStatus{
    let res = this.checkAvMoves(index);
    if(res != 'friend') result.push(index);
    return res;
  }
  generateAvailableMoves(piece: Piece, index: number): number[]{
    let result: number[] = [];
    let coord = ChessCanvas.getCoords(index);
    // RNBQKBNR
    // ROOKS //
    if(piece.toLowerCase() === 'r'){
      this.alignAxisMove(index, result);
    }
    // KNIGHTS //
    else if(piece.toLowerCase() === 'n'){
      let range = [[-2, 2], [-1, 1]];
      for(let i = 0; i < 2; i++){
        for(let xOffset of range[i]){
          for(let yOffset of range[1-i]){
            if(
              coord.x + xOffset < 0 
              || coord.x + xOffset > 7 
              || coord.y + yOffset < 0 
              || coord.y + yOffset > 7) continue;
            this.insertAvMoves(
              ChessCanvas.getIndex(
                {
                  x: coord.x + xOffset, 
                  y: coord.y + yOffset
                }
              ), result
            );
          }
        }
      }
    }
    // BISHOPS //
    else if(piece.toLowerCase() === 'b'){
      this.diagonalAxisMove(index, result);
    }
    // QUEEN //
    else if(piece.toLowerCase() === 'q'){
      this.alignAxisMove(index, result);
      this.diagonalAxisMove(index, result);
    }
    // KING //
    else if(piece.toLowerCase() === 'k'){
      if(coord.x != 0) this.insertAvMoves(index-1, result);
      if(coord.x != 7) this.insertAvMoves(index+1, result);
      if(coord.y != 0) this.insertAvMoves(index-8, result);
      if(coord.y != 7) this.insertAvMoves(index+8, result);
      if(coord.y != 7 && coord.x != 7) this.insertAvMoves(index+9, result);
      if(coord.y != 0 && coord.x != 7) this.insertAvMoves(index-7, result);
      if(coord.y != 7 && coord.x != 0) this.insertAvMoves(index+7, result);
      if(coord.y != 0 && coord.x != 0) this.insertAvMoves(index-9, result);
    }
    // PAWNS //
    else if(piece.toLowerCase() === 'p'){
      if(this.currentPlayer === this.firstPlayer){
        if(coord.y == 6){
          if(this.checkAvMoves(index - 16) === 'empty' && this.checkAvMoves(index - 8) === 'empty'){
            result.push(index-16);
          }
        }
        if(coord.y != 0){
          if(this.checkAvMoves(index - 8) === 'empty'){
            result.push(index-8);
          }
          if(coord.x != 0){
            if(this.checkAvMoves(index - 7) === 'enemy'){
              result.push(index - 7);
            }
          }
          if(coord.x != 7){
            if(this.checkAvMoves(index - 9) === 'enemy'){
              result.push(index - 9);
            }
          }
        }
      } else {
        if(coord.y == 1){
          if(this.checkAvMoves(index + 16) === 'empty' && this.checkAvMoves(index + 8) === 'empty'){
            result.push(index+16);
          }
        }
        if(coord.y != 7){
          if(this.checkAvMoves(index + 8) === 'empty'){
            result.push(index+8);
          }
          if(coord.x != 0){
            if(this.checkAvMoves(index + 7) === 'enemy'){
              result.push(index + 7);
            }
          }
          if(coord.x != 7){
            if(this.checkAvMoves(index + 9) === 'enemy'){
              result.push(index + 9);
            }
          }
        }
      }
    }

    return result;
  }
  checkAvMoves(index: number): MoveStatus{
    if(!this.board[index]){
      return 'empty';
    }
    // friend
    if(this.isFriend(index)) return 'friend';
    // enemy
    return 'enemy';
  }
  isEnemy(index: number): boolean{
    if(!this.board[index]) return false;
    return (this.board[index]! == this.board[index]!.toUpperCase()) === (this.currentPlayer == 'black');
  }
  isFriend(index: number): boolean{
    if(!this.board[index]) return false;
    return !this.isEnemy(index);
  }
  toXPlayer(piece: string, player: Player): string{
    return player == 'white' ? piece.toLowerCase() : piece.toUpperCase();
  }
  moduloNZ(num: number, modulus: number){
    let res = num % modulus;
    if(res == 0) res = modulus;
    return res;
  }
  alignAxisMove(index: number, result: number[]){
    let coord = ChessCanvas.getCoords(index);
    // up
    for(let i = index - 8; i >= 0; i -= 8) if(this.insertAvMoves(i, result) != 'empty') break;
    // down
    for(let i = index + 8; i < 64; i += 8) if(this.insertAvMoves(i, result) != 'empty') break;
    // right
    for(let i = this.moduloNZ(index + 1, 8); i < 8; i++) if(this.insertAvMoves(coord.y * 8 + i, result) != 'empty') break;
    // left
    for(let i = this.moduloNZ(index + 1, 8); i > 1; i--) if(this.insertAvMoves(coord.y * 8 + i - 2, result) != 'empty') break;
  }
  diagonalAxisMove(index: number, result: number[]){
    // top left
    let coord = ChessCanvas.getCoords(index);
    coord.x--;
    coord.y--;
    if(coord.x != 0 && coord.y != 0) while(coord.x >= 0 && coord.y >= 0){
      if(this.insertAvMoves(ChessCanvas.getIndex(coord), result) != 'empty')break;
      coord.x--;
      coord.y--;
    }
    // top right
    coord = ChessCanvas.getCoords(index);
    coord.x++;
    coord.y--;
    if(coord.x != 7 && coord.y != 0) while(coord.x <= 7 && coord.y >= 0){
      if(this.insertAvMoves(ChessCanvas.getIndex(coord), result) != 'empty')break;
      coord.x++;
      coord.y--;
    }
    // bottom left
    coord = ChessCanvas.getCoords(index);
    coord.x--;
    coord.y++;
    if(coord.x != 0 && coord.y != 7) while(coord.x >= 0 && coord.y <= 7){
      if(this.insertAvMoves(ChessCanvas.getIndex(coord), result) != 'empty')break;
      coord.x--;
      coord.y++;
    }
    // bottom right
    coord = ChessCanvas.getCoords(index);
    coord.x++;
    coord.y++;
    if(coord.x != 7 && coord.y != 7) while(coord.x <= 7 && coord.y <= 7){
      if(this.insertAvMoves(ChessCanvas.getIndex(coord), result) != 'empty') break;
      coord.x++;
      coord.y++;
    }
  }
}


function isUpperCase(source: string){
  return source == source.toUpperCase();
}

function isLowerCase(source: string){
  return source == source.toLowerCase();
}
