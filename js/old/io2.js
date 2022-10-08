function setFEN() {
  const fenStr = document.getElementById("FENField").value;
  game.setFEN(fenStr);
  window.board.setPosition(fenStr, true);
}

function getAIMove() {
  game.makeAIMove();
  // get best move
  window.board.setPosition(game.getFEN(), true);
}
