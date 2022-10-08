var $status = $("#status");
var $fen = $("#FENField");
var $pgn = $("#pgn");
var squareToHighlight = null;
var squareClass = "square-55d63";
var $board = $("#board1");

function removeHighlights(color) {
  $board.find("." + squareClass).removeClass("highlight-" + color);
}

function onDragStart(source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (GameBoard.GameOver) {
    return false;
  }

  // only pick up pieces for the side to move
  if (
    (GameBoard.side === COLOURS.WHITE && piece.search(/^b/) !== -1) ||
    (GameBoard.side === COLOURS.BLACK && piece.search(/^w/) !== -1)
  ) {
    return false;
  }
}

function makeAIMove() {
  if (GameBoard.GameOver) {
    return;
  }
  color = GameBoard.side == COLOURS.WHITE ? "white" : "black";
  removeHighlights(color);

  // get best move
  let bestMove = getBestMove();

  // highlight AI's move
  fSq = PrMove(bestMove).slice(0, 2);
  tSq = PrMove(bestMove).slice(2, 4);

  $board.find(".square-" + fSq).addClass(`highlight-${color}`);
  $board.find(".square-" + tSq).addClass(`highlight-${color}`);

  MakeMove(bestMove);

  board.position(GenerateFEN());
  CheckStatus();
}

function onDrop(source, target) {
  validMove = CheckValidMove(source, target);

  if (!validMove) return "snapback";

  sourceSq = OppositePrSq(source);
  targetSq = OppositePrSq(target);

  parsed = ParseMove(sourceSq, targetSq);

  if (parsed !== NOMOVE) {
    MakeMove(parsed);
    PrintBoard();
    GenerateFEN();

    // highlight white's move
    removeHighlights("white");
    $board.find(".square-" + source).addClass("highlight-white");
    $board.find(".square-" + target).addClass("highlight-white");

    // get AI move
    window.setTimeout(makeAIMove, 250);
  } else return "snapback";
}

function onMoveEnd() {
  $board.find(".square-" + squareToHighlight).addClass("highlight-black");
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd() {
  console.log(EvalPosition());
  board.position(GenerateFEN());
  CheckStatus();
}

var config = {
  draggable: true,
  position: "start",
  onDragStart: onDragStart,
  onDrop: onDrop,
  onMoveEnd: onMoveEnd,
  onSnapEnd: onSnapEnd,
};

board = Chessboard("board1", config);

function CheckResult() {
  // update FEN
  $fen.val(GenerateFEN());

  let SideToMove = GameBoard.side == COLOURS.WHITE ? "White" : "Black";
  $("#GameStatus").text(`${SideToMove} to move`);

  if (GameBoard.fiftyMove >= 100) {
    $("#GameStatus").text("Game drawn by fifty move rule");
    return true;
  }

  if (ThreeFoldRep() >= 2) {
    $("#GameStatus").text("Game drawn by 3-fold repetition");
    return true;
  }

  if (DrawMaterial() == true) {
    $("#GameStatus").text("Game drawn by insufficient material");
    return true;
  }

  GenerateMoves();

  var MoveNum = 0;
  var found = 0;

  for (
    MoveNum = GameBoard.moveListStart[GameBoard.ply];
    MoveNum < GameBoard.moveListStart[GameBoard.ply + 1];
    ++MoveNum
  ) {
    if (MakeMove(GameBoard.moveList[MoveNum]) == false) {
      continue;
    }
    found++;
    TakeMove();
    break;
  }

  var InCheck = SqAttacked(
    GameBoard.pList[getPieceIndex(Kings[GameBoard.side], 0)],
    GameBoard.side ^ 1
  );

  if (found != 0) {
    if (InCheck) {
      $("#GameStatus").text("Check");
    }
    return false;
  }

  if (InCheck == true) {
    if (GameBoard.side == COLOURS.WHITE) {
      $("#GameStatus").text("GAME OVER {black mates}");
      return true;
    } else {
      $("#GameStatus").text("GAME OVER {white mates}");
      return true;
    }
  } else {
    $("#GameStatus").text("GAME DRAWN {stalemate}");
    return true;
  }
}

function CheckStatus() {
  if (CheckResult()) {
    GameBoard.GameOver = true;
  } else {
    GameBoard.GameOver = false;
  }
}
