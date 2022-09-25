$("#SetFen").click(function () {
  var fenStr = $("#FENField").val();
  ParseFen(fenStr);
  board.position(fenStr);
  CheckStatus();
});

$("#NewGame").click(function () {});

function copyFEN() {
  // Get the text field
  var copyText = document.getElementById("FENField");

  // Select the text field
  copyText.select();
  copyText.setSelectionRange(0, 99999); // For mobile devices

  // Copy the text inside the text field
  navigator.clipboard
    .writeText(copyText.value)
    .then(() => {
      alert("FEN copied to clipboard");
    })
    .catch(() => {
      alert("Oops, something went wrong.");
    });
}

function resetBoard() {
  ParseFen(START_FEN);
  board.position(START_FEN);

  setTimeout(() => {
    removeHighlights("white");
    removeHighlights("black");
  }, 500);
}

function flipBoard() {
  board.flip();
}
