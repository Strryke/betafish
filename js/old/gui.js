$("#SetFen").click(function () {
  var fenStr = $("#FENField").val();
  ParseFen(fenStr);
  board.position(fenStr);
  // CheckStatus();
  // PerftTest(5);
  console.log(EvalPosition());
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
  if (window.confirm("Are you sure you want to reset the board?")) {
    ParseFen(START_FEN);
    board.position(START_FEN);

    setTimeout(() => {
      removeHighlights("white");
      removeHighlights("black");
    }, 500);
  }
}

function flipBoard() {
  board.flip();
}

function takeBack() {
  alert("Just like in life, there are no takebacks.");
}
