type Piece = 'r' | 'n' | 'b' | 'q' | 'k' | 'p' | 'R' | 'N' | 'B' | 'Q' | 'K' | 'P';
type Player = 'white' | 'black';

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
  move(from: number, to: number){
    this.board[to] = this.board[from];
    this.board[from] = undefined;
  }
  clicked(index: number): boolean{
    if(this.selectedIndex == index) return false;
    // select
    if(this.board[index] 
      && this.isFriend(index)){
      this.selectedIndex = index;
      this.availableMoves = this.generateAvailableMoves(this.board[index]!, index);
      return true;
    }
    if(this.availableMoves.indexOf(index) != -1){
      this.move(this.selectedIndex!, index);
      this.selectedIndex = undefined;
      this.availableMoves = [];
      this.currentPlayer = this.currentPlayer == 'black' ? 'white' : 'black';
      return true;
    }
    return false;
  }
  checkAvailabeMove(index: number, result: number[]){
    if(!this.board[index]){
      result.push(index);
      return false;
    }
    // friend
    if(this.isFriend(index)) return true;
    // enemy
    result.push(index);
    return true;
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
            this.checkAvailabeMove(
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
      if(coord.x != 0) this.checkAvailabeMove(index-1, result);
      if(coord.x != 7) this.checkAvailabeMove(index+1, result);
      if(coord.y != 0) this.checkAvailabeMove(index-8, result);
      if(coord.y != 7) this.checkAvailabeMove(index+8, result);
      if(coord.y != 7 && coord.x != 7) this.checkAvailabeMove(index+9, result);
      if(coord.y != 0 && coord.x != 7) this.checkAvailabeMove(index-7, result);
      if(coord.y != 7 && coord.x != 0) this.checkAvailabeMove(index+7, result);
      if(coord.y != 0 && coord.x != 0) this.checkAvailabeMove(index-9, result);
    }
    // PAWNS //
    else if(piece.toLowerCase() === 'p'){
      if(this.currentPlayer === this.firstPlayer){
        if(coord.y == 6){
          this.checkAvailabeMove(index - 16, result)
        }
        this.checkAvailabeMove(index - 8, result)
      } else {
        if(coord.y == 1){
          this.checkAvailabeMove(index + 16, result)
        }
        this.checkAvailabeMove(index + 8, result)
      }
    }

    return result;
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
    for(let i = index - 8; i >= 0; i -= 8) if(this.checkAvailabeMove(i, result)) break;
    // down
    for(let i = index + 8; i < 64; i += 8) if(this.checkAvailabeMove(i, result)) break;
    // right
    for(let i = this.moduloNZ(index + 1, 8); i < 8; i++) if(this.checkAvailabeMove(coord.y * 8 + i, result)) break;
    // left
    for(let i = this.moduloNZ(index + 1, 8); i > 1; i--) if(this.checkAvailabeMove(coord.y * 8 + i - 2, result)) break;
  }
  diagonalAxisMove(index: number, result: number[]){
    // top left
    let coord = ChessCanvas.getCoords(index);
    coord.x--;
    coord.y--;
    if(coord.x != 0 && coord.y != 0) while(coord.x >= 0 && coord.y >= 0){
      if(this.checkAvailabeMove(ChessCanvas.getIndex(coord), result))break;
      coord.x--;
      coord.y--;
    }
    // top right
    coord = ChessCanvas.getCoords(index);
    coord.x++;
    coord.y--;
    if(coord.x != 7 && coord.y != 0) while(coord.x <= 7 && coord.y >= 0){
      if(this.checkAvailabeMove(ChessCanvas.getIndex(coord), result))break;
      coord.x++;
      coord.y--;
    }
    // bottom left
    coord = ChessCanvas.getCoords(index);
    coord.x--;
    coord.y++;
    if(coord.x != 0 && coord.y != 7) while(coord.x >= 0 && coord.y <= 7){
      if(this.checkAvailabeMove(ChessCanvas.getIndex(coord), result))break;
      coord.x--;
      coord.y++;
    }
    // bottom right
    coord = ChessCanvas.getCoords(index);
    coord.x++;
    coord.y++;
    if(coord.x != 7 && coord.y != 7) while(coord.x <= 7 && coord.y <= 7){
      if(this.checkAvailabeMove(ChessCanvas.getIndex(coord), result)) break;
      coord.x++;
      coord.y++;
    }
  }
}
