var board = null;
var game = new Chess();

var $status = $("#status");
var $fen = $("#fen");
var $pgn = $("#pgn");
var $nodes = $("#nodes");
var $quiescence_nodes = $("#quiescenceNodes");
var $time_taken = $("#timeTaken");
var $getMove = $("#getMove");
var $setFen = $("#setFEN");
var $evaluated_score = $("#evaluatedScore");

var time_taken = 0;
var nodes = 0;
var quiescence_nodes = 0;

$getMove.click(() => {
  // console.log(getBestMove());
  // console.log(game.ugly_moves());
  // game.ugly_move(getBestMove());
  game.ugly_move(getBestMove());
  board.position(game.fen());
  updateStatus();
  console.log(endgame);
});

$setFen.click(() => {
  let newFen = $("#fen").val();
  console.log(newFen);
  // game = new Chess(newFen);
  game.load(newFen);
  board.position(game.fen());
});

function makeMove() {
  game.ugly_move(getBestMove());
  board.position(game.fen());
  updateStatus();
}

// AI Game Logic

function quiescence(alpha, beta, depth) {
  quiescence_nodes++;
  const evaluation = evaluate();

  if (depth <= 0) return alpha;
  if (evaluation >= beta) return beta;
  if (alpha < evaluation) alpha = evaluation;

  var specialMoves = [];
  const uglyMoves = game.ugly_moves();

  for (let i = 0; i < uglyMoves.length; i++) {
    game.ugly_move(uglyMoves[i]);
    if (game.in_check() || game.in_checkmate()) {
      specialMoves.push(uglyMoves[i]);
    }
    game.undo();

    // moves with takes
    if (uglyMoves[i].captured != undefined) {
      specialMoves.push(uglyMoves[i]);
    }
  }

  for (var i = 0; i < specialMoves.length; i++) {
    game.ugly_move(specialMoves[i]);
    var score = -quiescence(-beta, -alpha, depth - 1);
    game.undo();
    if (score >= beta) return beta;
    if (score > alpha) alpha = score;
  }

  return alpha;
}

getOrderedMoves();

function evaluateMoveScore(move) {
  // promotions -> captures -> normal moves
  const captureScores = {
    q: 9,
    r: 5,
    b: 3,
    n: 3,
    p: 1,
  };

  if (move.promotion != undefined) return { ...move, score: 10 };

  if (move.captured != undefined)
    return {
      ...move,
      score: captureScores[move.captured] - captureScores[move.piece],
    };

  return { ...move, score: 0 };
}

function getOrderedMoves() {
  const moves = game.ugly_moves();
  const movesWithScores = moves.map((move) => evaluateMoveScore(move));
  const sortedMoves = movesWithScores.sort((a, b) => b.score - a.score);

  return sortedMoves;
}

function getBestMove() {
  var start_time = performance.now();
  var depth = endgame ? 4 : 3;
  // var moves = game.moves();
  // const moves = getOrderedMoves();
  // const moves = game.ugly_moves();
  const moves = getOrderedMoves();
  var max = -Infinity;
  var best_move;

  for (var i in moves) {
    game.ugly_move(moves[i]);
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
}

function negamax(depth, alpha, beta) {
  nodes++;
  if (depth == 0) {
    // return evaluate();
    return quiescence(alpha, beta, 4);
  }

  const moves = getOrderedMoves();
  var l = moves.length;
  for (var i = 0; i < l; i++) {
    game.ugly_move(moves[i]);
    var score = -negamax(1 - 1, -beta, -alpha);
    game.undo();

    if (score >= beta) {
      return beta;
    } // beta cutoff
    if (score > alpha) {
      alpha = score;
    }
  }

  if (game.in_draw() || game.in_stalemate() || game.in_threefold_repetition())
    return 0;

  return alpha;
}
