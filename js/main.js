var board = null;
var game = new Chess();

var $status = $("#status");
var $fen = $("#fen");
var $pgn = $("#pgn");
var $nodes = $("#nodes");
var $quiescence_nodes = $("#quiescenceNodes");
var $time_taken = $("#timeTaken");
var $getMove = $("#getMove");

var time_taken = 0;
var nodes = 0;
var quiescence_nodes = 0;

$getMove.click(() => {
  console.log(rootnegamax());
});

const reverse_array = function (array) {
  return array.slice().reverse();
};

// value of pieces for evaluate function
const pawn_value = 100;
const knight_value = 320;
const bishop_value = 330;
const rook_value = 500;
const queen_value = 900;
const king_value = 20000;

// Piece-Square Tables from the chessprogramming wiki for a simplified evaluation function https://www.chessprogramming.org/Simplified_Evaluation_Function
var black_pawn = [
  0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 50, 50, 50, 50, 50, 50, 10, 10, 20, 30, 30,
  20, 10, 10, 5, 5, 10, 25, 25, 10, 5, 5, 0, 0, 0, 20, 20, 0, 0, 0, 5, -5, -10,
  0, 0, -10, -5, 5, 5, 10, 10, -20, -20, 10, 10, 5, 0, 0, 0, 0, 0, 0, 0, 0,
];
var white_pawn = reverse_array(black_pawn);
var black_knight = [
  -50, -40, -30, -30, -30, -30, -40, -50, -40, -20, 0, 0, 0, 0, -20, -40, -30,
  0, 10, 15, 15, 10, 0, -30, -30, 5, 15, 20, 20, 15, 5, -30, -30, 0, 15, 20, 20,
  15, 0, -30, -30, 5, 10, 15, 15, 10, 5, -30, -40, -20, 0, 5, 5, 0, -20, -40,
  -50, -40, -30, -30, -30, -30, -40, -50,
];
var white_knight = reverse_array(black_knight);
var black_bishop = [
  -20, -10, -10, -10, -10, -10, -10, -20, -10, 0, 0, 0, 0, 0, 0, -10, -10, 0, 5,
  10, 10, 5, 0, -10, -10, 5, 5, 10, 10, 5, 5, -10, -10, 0, 10, 10, 10, 10, 0,
  -10, -10, 10, 10, 10, 10, 10, 10, -10, -10, 5, 0, 0, 0, 0, 5, -10, -20, -10,
  -10, -10, -10, -10, -10, -20,
];
var white_bishop = reverse_array(black_bishop);
var black_rook = [
  0, 0, 0, 0, 0, 0, 0, 0, 5, 10, 10, 10, 10, 10, 10, 5, -5, 0, 0, 0, 0, 0, 0,
  -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0,
  -5, -5, 0, 0, 0, 0, 0, 0, -5, 0, 0, 0, 5, 5, 0, 0, 0,
];
var white_rook = reverse_array(black_rook);
var black_queen = [
  -20, -10, -10, -5, -5, -10, -10, -20, -10, 0, 0, 0, 0, 0, 0, -10, -10, 0, 5,
  5, 5, 5, 0, -10, -5, 0, 5, 5, 5, 5, 0, -5, 0, 0, 5, 5, 5, 5, 0, -5, -10, 5, 5,
  5, 5, 5, 0, -10, -10, 0, 5, 0, 0, 0, 0, -10, -20, -10, -10, -5, -5, -10, -10,
  -20,
];
var white_queen = reverse_array(black_queen);
var black_king = [
  -30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40, -40,
  -30, -30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40,
  -40, -30, -20, -30, -30, -40, -40, -30, -30, -20, -10, -20, -20, -20, -20,
  -20, -20, -10, 20, 20, 0, 0, 0, 0, 20, 20, 20, 30, 10, 0, 0, 10, 30, 20,
];
var white_king = reverse_array(black_king);
var black_king_endgame = [
  -50, -40, -30, -20, -20, -30, -40, -50, -30, -20, -10, 0, 0, -10, -20, -30,
  -30, -10, 20, 30, 30, 20, -10, -30, -30, -10, 30, 40, 40, 30, -10, -30, -30,
  -10, 30, 40, 40, 30, -10, -30, -30, -10, 20, 30, 30, 20, -10, -30, -30, -30,
  0, 0, 0, 0, -30, -30, -50, -30, -30, -30, -30, -30, -30, -50,
];

const onDrop = (sourceSquare, targetSquare) => {
  // see if the move is legal
  var move = game.move({
    from: sourceSquare,
    to: targetSquare,
    promotion: "q", // NOTE: always promote to a queen for example simplicity
  });

  // illegal move
  if (move === null) return "snapback";
  setTimeout(() => makeMove(), 200);
};

function makeMove() {
  game.move(rootnegamax());
  board.position(game.fen());
  updateStatus();
}

// AI Game Logic
function evaluate() {
  if (game.in_checkmate()) {
    return game.turn() === "w" ? 999999 : -999999;
  }
  if (game.in_threefold_repetition() || game.in_stalemate() || game.in_draw()) {
    return game.turn() === "w" ? 999999 : -999999;
  }

  var total = 0;

  // loop through the board
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      // get every piece
      var piece = game.get(String.fromCharCode(97 + i) + (j + 1));

      // exit as soon as possible if there's not piece
      if (!piece) {
        continue;
      }

      var index = j * 8 + i;
      switch (piece.type) {
        case "p":
          total +=
            piece.color == "w"
              ? pawn_value + white_pawn[index]
              : -(pawn_value + black_pawn[index]);
          break;
        case "n":
          total +=
            piece.color == "w"
              ? knight_value + white_knight[index]
              : -(knight_value + black_knight[index]);
          break;
        case "b":
          total +=
            piece.color == "w"
              ? bishop_value + white_bishop[index]
              : -(bishop_value + black_bishop[index]);
          break;
        case "r":
          total +=
            piece.color == "w"
              ? rook_value + white_rook[index]
              : -(rook_value + black_rook[index]);
          break;
        case "q":
          total +=
            piece.color == "w"
              ? queen_value + white_queen[index]
              : -(queen_value + black_queen[index]);
          break;
        case "k":
          total +=
            piece.color == "w"
              ? king_value + white_king[index]
              : -(king_value + black_king[index]);
          break; // CHANGE TO "w/b_king_endgame" table on endgame positions
      }
    }
  }

  return game.turn() === "w" ? total : -total;
}

function quiescence(alpha, beta, depth) {
  quiescence_nodes++;
  const evaluation = evaluate();

  if (depth == 0) return alpha;
  if (evaluation >= beta) return beta;
  if (alpha < evaluation) alpha = evaluation;

  const movesWithTakes = game.moves()?.filter((move) => move.includes("x"));
  for (var i = 0; i < movesWithTakes.length; i++) {
    game.move(movesWithTakes[i]);
    var score = -quiescence(-beta, -alpha, depth - 1);
    game.undo();
    if (score >= beta) return beta;
    if (score > alpha) alpha = score;
  }

  return alpha;
}

function getOrderedMoves() {
  const moves = game.moves({ verbose: true });

  const calculatedMoves = []; // [{ move: "a3", value: 2 }]
  // how data looks
  // { color: 'w', from: 'a2', to: 'a3',
  //   flags: 'n', piece: 'p', san 'a3'
  //   # a captured: key is included when the move is a capture
  //   # a promotion: key is included when the move is a promotion
  // },

  // relevant flags = p (promotion), c (capture), n (normal)
  // we should return sorted move list
  for (let i = 0; i < moves.length; i++) {
    calculatedMoves.push(evaluateMove(moves[i]));
  }
  // sort by value
  const sortedMoves = calculatedMoves
    .sort((a, b) => b.value - a.value)
    .map((move) => move.move);

  return sortedMoves;
}

function updateStatus() {
  var status = "";

  var moveColor = "White";
  if (game.turn() === "b") {
    moveColor = "Black";
  }

  // checkmate?
  if (game.in_checkmate()) {
    status = "Game over, " + moveColor + " is in checkmate.";
  }

  // draw?
  else if (game.in_draw()) {
    status = "Game over, drawn position";
  }

  // game still on
  else {
    status = moveColor + " to move";

    // check?
    if (game.in_check()) {
      status += ", " + moveColor + " is in check";
    }
  }

  $status.html(status);
  $fen.html(game.fen());
  $pgn.html(game.pgn());
  $nodes.html(nodes);
  $quiescence_nodes.html(quiescence_nodes);
  $time_taken.html((time_taken / 1000).toFixed(2) + "s");

  quiescence_nodes = 0;
  nodes = 0;
  time_taken = 0;
}

const evaluateMove = ({ piece, captured, promotion, flags, san }) => {
  const takeValues = {
    p: 10,
    n: 9,
    b: 8,
    r: 7,
    q: 6,
    k: 5,
  };
  // promotion gives highest value
  if (flags?.includes("p")) return { move: san, value: 11 };

  // next we look at captures
  if (flags?.includes("c"))
    return { move: san, value: takeValues[piece] - takeValues[captured] };

  // no captures, default to -99
  return { move: san, value: -99 };
};

var rootnegamax = function () {
  var start_time = performance.now();
  var depth = 3;
  // var moves = game.moves();
  const moves = getOrderedMoves();
  var max = -Infinity;
  var best_move;

  for (var i in moves) {
    game.move(moves[i]);
    var score = -negamax(depth - 1, -999999, 999999);
    game.undo();

    if (score > max) {
      max = score;
      best_move = moves[i];
    }
  }

  var end_time = performance.now();
  time_taken = end_time - start_time;

  return best_move;
};

var negamax = function (depth, alpha, beta) {
  nodes++;
  if (depth == 0) {
    return evaluate();
    // return quiescence(alpha, beta, 2);
  }

  //null move pruning
  // if (depth > 1) {
  //   nullMove();
  //   var null_move_score = -negamax(depth - 1, -beta, -beta + 1);
  //   nullMove();
  //   if (null_move_score >= beta) return beta;
  // }

  // var moves = game.moves();
  const moves = getOrderedMoves();
  var l = moves.length;
  for (var i = 0; i < l; i++) {
    game.move(moves[i]);
    var score = -negamax(depth - 1, -beta, -alpha);
    game.undo();

    if (score >= beta) {
      return beta;
    } // beta cutoff
    if (score > alpha) {
      alpha = score;
    }
  }

  return alpha;
};

const config = {
  draggable: true,
  position: "start",
  onDrop: onDrop,
};

board = Chessboard("myBoard", config);

// window.setTimeout(makeRandomMove, 500);
