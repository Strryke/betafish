function setFEN() {
  const fenStr = document.getElementById("FENField").value;
  game.setFEN(fenStr);
  window.board.setPosition(fenStr, true);
}
