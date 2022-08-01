import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import dynamic from "next/dynamic";
import { Chess } from "chess.js";
import { useEffect, useState } from "react";

const Chessboard = dynamic(() => import("chessboardjsx"), {
  ssr: false, // <- this do the magic ;)
});

export default function Home() {
  const [position, setPosition] = useState("start");
  const [game, setGame] = useState();

  useEffect(() => {
    setGame(new Chess());
    // setTimeout(() => randomMove(), 1000);
  }, []);

  const onDrop = ({ sourceSquare, targetSquare }) => {
    // see if the move is legal
    var move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // NOTE: always promote to a queen for example simplicity
    });

    setPosition(game.fen());

    // illegal move
    if (move === null) return "snapback";

    // make random legal move for black
    window.setTimeout(randomMove, 300);
  };

  const boardScore = (fen) => {
    // fen = rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
    // caps are for white
    // white is maximizing player
    const pieceWorth = {
      p: -1,
      P: 1,
      k: -3,
      K: 3,
      b: -3,
      B: 3,
      r: -5,
      R: 5,
      q: -3,
      Q: 3,
      k: -1000,
      K: 1000,
    };
    const pieces = fen.split(" ")[0].split("");
    const score = 0;
    for (const piece in pieces) {
      score += pieceWorth[pieces[piece]] || 0;
    }
    return score;
  };

  //https://www.chessprogramming.org/Negamax
  const rootNegamax = (game, depth, isMaximizing) => {
    const possibleMoves = game.moves();
    const bestMove = null;
    const bestScore = -9999;
    for (const move of possibleMoves) {
      game.move(move);
      const value = negamax(game, depth - 1, !isMaximizing);
      game.undo();
      if (value > bestScore) {
        bestScore = value;
        bestMove = move;
      }
    }
    return bestMove;
  };

  const negamax = (game, depth, isMaximizing) => {
    if (depth === 0) {
      return boardScore(game.fen());
    }
    const possibleMoves = game.moves();
    let bestScore = -9999;
    for (const move of possibleMoves) {
      game.move(move);
      const value = -negamax(game, depth - 1, !isMaximizing);
      game.undo();
      if (isMaximizing) {
        if (value > bestScore) {
          bestScore = value;
        }
      } else {
        if (value < bestScore) {
          bestScore = value;
        }
      }
    }
    return bestScore;
  };

  const randomMove = () => {
    const randomIndex = (arraylength) =>
      Math.floor(Math.random() * arraylength);

    const possibleMoves = game.moves();
    // console.log(possibleMoves);
    // a capture will have x inside, eg. 'dxe5'

    // const moveWithCapture = possibleMoves.filter((move) => move.includes("x"));
    // if (moveWithCapture) {
    //   game.move(moveWithCapture[randomIndex(moveWithCapture.length)]);
    // }

    // game.move(possibleMoves[randomIndex(possibleMoves.length)]);
    // setPosition(game.fen());

    // console.log(boardScore(game.fen()));
    // console.log(negamax(game, 1, false));
    console.log(rootNegamax(game, 2, false));

    // timer();
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <Chessboard
          position={position}
          transitionDuration={100}
          onDrop={onDrop}
        />
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}