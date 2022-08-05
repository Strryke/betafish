import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import dynamic from "next/dynamic";
import { Chess } from "chess.js";
import { useEffect, useState } from "react";

const Chessboard = dynamic(() => import("chessboardjsx"), {
  ssr: false, // <- this do the magic ;)
});

var reverse_array = function (array) {
  return array.slice().reverse();
};

export default function Test() {
  const [position, setPosition] = useState("start");
  const [game, setGame] = useState();
  const [gameState, setGameState] = useState("");
  const [orientation, setOrientation] = useState();
  const [positionsEvaluated, setPositionsEvaluated] = useState(0);
  const [quiescenceNodes, setQuiescenceNodes] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const [fenInput, setFenInput] = useState("");

  var pawn_value = 100;
  var knight_value = 320;
  var bishop_value = 330;
  var rook_value = 500;
  var queen_value = 900;
  var king_value = 20000;

  useEffect(() => {
    setGame(new Chess());
    // setTimeout(() => randomMove(), 1000);
  }, []);

  useEffect(() => {
    setPositionsEvaluated(0);
  }, [orientation]);

  const setFen = () => {
    setPosition(fenInput);
    game.load(fenInput);
  };

  const onDrop = ({ sourceSquare, targetSquare }) => {
    // see if the move is legal
    var move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // NOTE: always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return "snapback";
    setPosition(game.fen());

    // setTimeout(() => makeMove(), 300);
  };

  const makeMove = () => {
    setPositionsEvaluated(0);
    setQuiescenceNodes(0);
    game.move(rootnegamax());
    setPosition(game.fen());
  };

  // const boardScore = (fen) => {
  //   // fen = rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
  //   // caps are for white
  //   // white is maximizing player
  //   const pieceWorth = {
  //     p: -1,
  //     P: 1,
  //     k: -3,
  //     K: 3,
  //     b: -3,
  //     B: 3,
  //     r: -5,
  //     R: 5,
  //     q: -3,
  //     Q: 3,
  //     k: -99999,
  //     K: 99999,
  //   };
  //   const pieces = fen.split(" ")[0].split("");
  //   const score = 0;
  //   for (const piece in pieces) {
  //     score += pieceWorth[pieces[piece]] || 0;
  //   }

  //   if (game.turn() === "b" && game.in_checkmate()) score += 99999999;
  //   if (game.turn() === "w" && game.in_checkmate()) score -= 99999999;

  //   return score;
  // };

  var evaluate = function () {
    if (game.in_checkmate()) {
      return game.turn() === "w" ? 999999 : -999999;
    }
    if (
      game.in_threefold_repetition() ||
      game.in_stalemate() ||
      game.in_draw()
    ) {
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

        /* add the piece value
         * p > pawn > 100
         * n > knight > 320
         * b > bishop > 330
         * r > rook > 500
         * q > queen > 900
         * k > king > 20000
         */
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
        /* Also give bonuses and maluses
         * ADD BISHOP PAIR BONUS
         * ADD KNIGHT PAIR MALUS
         * ADD PAWN STRUCTURE BONUS / MALUS
         * ADD KING PROXIMITY ON ENDGAME
         */
      }
    }

    return game.turn() === "w" ? total : -total;
  };

  const quiescence = (alpha, beta, depth) => {
    setQuiescenceNodes((e) => e + 1);
    const evaluation = evaluate();

    if (depth == 0) return alpha;

    if (evaluation >= beta) {
      return beta;
    }
    if (alpha < evaluation) {
      alpha = evaluation;
    }

    const movesWithTakes = game.moves()?.filter((move) => move.includes("x"));
    for (var i = 0; i < movesWithTakes.length; i++) {
      game.move(movesWithTakes[i]);

      var score = -quiescence(-beta, -alpha, depth - 1);
      game.undo();

      if (score >= beta) return beta;
      if (score > alpha) alpha = score;
    }

    return alpha;
  };

  const getOrderedMoves = () => {
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
    for (const i = 0; i < moves.length; i++) {
      calculatedMoves.push(evaluateMove(moves[i]));
    }
    // sort by value
    const sortedMoves = calculatedMoves
      .sort((a, b) => b.value - a.value)
      .map((move) => move.move);

    return sortedMoves;
  };

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

  const nullMove = () => {
    const currentFen = game.fen().split(" ");
    const currentColor = game.turn();
    const newColor = currentColor == "w" ? "b" : "w";
    let newFen = currentFen;
    newFen[1] = newColor;
    game.load(newFen.join(" "));
  };

  // Negamax algorithm root
  var rootnegamax = function () {
    var start_time = performance.now();
    var depth = 3;
    var moves = game.moves();
    // const moves = getOrderedMoves();
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
    var time_taken = end_time - start_time;

    setTimeTaken((time_taken / 1000).toFixed(3));
    return best_move;
  };

  var negamax = function (depth, alpha, beta) {
    setPositionsEvaluated((e) => e + 1);
    if (depth == 0) {
      // return evaluate();
      return quiescence(alpha, beta, 2);
    }

    //null move pruning
    // if (depth > 1) {
    //   nullMove();
    //   var null_move_score = -negamax(depth - 1, -beta, -beta + 1);
    //   nullMove();
    //   if (null_move_score >= beta) return beta;
    // }

    var moves = game.moves();
    // const moves = getOrderedMoves();
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

  var black_pawn = [
    0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 50, 50, 50, 50, 50, 50, 10, 10, 20, 30, 30,
    20, 10, 10, 5, 5, 10, 25, 25, 10, 5, 5, 0, 0, 0, 20, 20, 0, 0, 0, 5, -5,
    -10, 0, 0, -10, -5, 5, 5, 10, 10, -20, -20, 10, 10, 5, 0, 0, 0, 0, 0, 0, 0,
    0,
  ];

  var white_pawn = reverse_array(black_pawn);

  var black_knight = [
    -50, -40, -30, -30, -30, -30, -40, -50, -40, -20, 0, 0, 0, 0, -20, -40, -30,
    0, 10, 15, 15, 10, 0, -30, -30, 5, 15, 20, 20, 15, 5, -30, -30, 0, 15, 20,
    20, 15, 0, -30, -30, 5, 10, 15, 15, 10, 5, -30, -40, -20, 0, 5, 5, 0, -20,
    -40, -50, -40, -30, -30, -30, -30, -40, -50,
  ];

  var white_knight = reverse_array(black_knight);

  var black_bishop = [
    -20, -10, -10, -10, -10, -10, -10, -20, -10, 0, 0, 0, 0, 0, 0, -10, -10, 0,
    5, 10, 10, 5, 0, -10, -10, 5, 5, 10, 10, 5, 5, -10, -10, 0, 10, 10, 10, 10,
    0, -10, -10, 10, 10, 10, 10, 10, 10, -10, -10, 5, 0, 0, 0, 0, 5, -10, -20,
    -10, -10, -10, -10, -10, -10, -20,
  ];

  var white_bishop = reverse_array(black_bishop);

  var black_rook = [
    0, 0, 0, 0, 0, 0, 0, 0, 5, 10, 10, 10, 10, 10, 10, 5, -5, 0, 0, 0, 0, 0, 0,
    -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0,
    0, -5, -5, 0, 0, 0, 0, 0, 0, -5, 0, 0, 0, 5, 5, 0, 0, 0,
  ];

  var white_rook = reverse_array(black_rook);

  var black_queen = [
    -20, -10, -10, -5, -5, -10, -10, -20, -10, 0, 0, 0, 0, 0, 0, -10, -10, 0, 5,
    5, 5, 5, 0, -10, -5, 0, 5, 5, 5, 5, 0, -5, 0, 0, 5, 5, 5, 5, 0, -5, -10, 5,
    5, 5, 5, 5, 0, -10, -10, 0, 5, 0, 0, 0, 0, -10, -20, -10, -10, -5, -5, -10,
    -10, -20,
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

  var white_king_endgame = reverse_array(black_king_endgame);

  const getPgn = () => {
    console.log(game.pgn());
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Chessboard
          position={position}
          transitionDuration={100}
          onDrop={onDrop}
        />

        <h5>Gamestate: {gameState}</h5>
        <h5>Positions evaluated: {positionsEvaluated}</h5>
        <h5>Quiescence nodes: {quiescenceNodes}</h5>
        <h5>Time taken: {timeTaken}s</h5>
        <button onClick={getPgn}>print pgn</button>
        <button onClick={() => console.log(rootnegamax())}>get move</button>
        <button onClick={makeMove}>make move</button>
        <input
          type={"text"}
          onChange={(e) => setFenInput(e.target.value)}
        ></input>
        <button onClick={setFen}>set fen</button>
        <button onClick={() => console.log(game.fen())}>print fen</button>
        <button onClick={() => nullMove()}>null move</button>
        <button onClick={() => console.log(game.moves({ verbose: true }))}>
          verbose move
        </button>
        <button onClick={() => console.log(getOrderedMoves())}>
          sorted moves
        </button>
      </main>
    </div>
  );
}
