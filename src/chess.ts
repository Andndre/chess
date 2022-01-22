type Piece = 'r' | 'n' | 'b' | 'q' | 'k' | 'p' | 'R' | 'N' | 'B' | 'Q' | 'K' | 'P';
type Player = 'white' | 'black';

class Chess{
  private board: Piece[] | undefined[];
  private currentPlayer: Player;
  constructor(fenString: string){
    this.board = [];
    this.currentPlayer = fenString[0] === fenString[0].toLowerCase() ? 'black' : 'white';
    let index = 0;
    for(let row of fenString.split('/')){
      for(let char of row){
        if(char in ['1', '2', '3', '4', '5', '6', '7', '8', '9']){
          index += Number.parseInt(char);
          continue;
        }
        this.board[index] = char as Piece;
        index++;
      }
    }
  }
  getBoard(): Piece[] | undefined[]{
    return this.board;
  }
}
