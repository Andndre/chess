let canvas = document.getElementById('canvas') as HTMLCanvasElement;
let chess = new Chess('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
let board = new Board(chess, canvas);

canvas.addEventListener('click', (e) => {
  if(chess.clicked(Board.getCLickedIndex(e.clientX, e.clientY))){
    board.draw();
  };
});

window.addEventListener('load', (ev) => {
  board.draw();
});
