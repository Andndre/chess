class ChessCanvas{
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private light = '#dbedcc';
  private dark = '#6c914c';
  private chess: Chess;
  public img: CanvasImageSource;
  private boxScale = window.innerHeight/8;
  
  constructor(chess: Chess){
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.canvas.height = window.innerHeight;
    this.canvas.width = window.innerWidth;
    this.chess = chess;
    this.ctx.font = this.boxScale * 0.2 + 'px Arial';
    this.img = document.getElementById('sprite') as CanvasImageSource;
    this.draw(this.chess.getBoard());
  }

  draw(board: Piece[] | undefined[]){
    for(let i = 0; i < 8; i++){
      for(let j = 0; j < 8; j++){
        console.log('test')
        // draw box
        this.ctx.fillStyle = (i + j) % 2 === 0 
          ? this.light
            : this.dark;
        this.ctx.fillRect(
          j * this.boxScale, 
          i * this.boxScale, 
          this.boxScale, 
          this.boxScale
        );

        // draw the marking things
        if(i === 7){
          this.ctx.fillStyle = j % 2 === 0 ? this.light : this.dark;
          this.ctx.fillText(
            String.fromCharCode(97 + j), 
            j * this.boxScale + this.boxScale * 0.8, 
            i * this.boxScale + this.boxScale * 0.95
          );
        }
        if(j === 0){
          this.ctx.fillStyle = i % 2 === 0 ? this.dark : this.light;
          this.ctx.fillText(
            String.fromCharCode(49 +  (7 - i)), 
            this.boxScale * 0.05, 
            i * this.boxScale + this.boxScale * 0.2
          );
        }

        // draw piece
        let index = j + i * 8;
        if(!board[index]) continue;
        this.drawPiece(board[index]!, index);
      }
    }
  }

  drawPiece(name: Piece, index: number){
    let black = name == name.toUpperCase();
    let dy = black ? 213 : 0;
    let dx = ['k', 'q', 'b', 'n', 'r', 'p'].indexOf(name.toLowerCase()) * 213;
    let i = Math.floor(index/8);
    let j = index % 8;
    this.ctx.drawImage(
      this.img, 
      dx,dy,213,213,
      j * this.boxScale, 
      i * this.boxScale, 
      this.boxScale, 
      this.boxScale
    )
  }
}
