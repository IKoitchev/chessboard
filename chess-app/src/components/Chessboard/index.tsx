import { FunctionComponent, useEffect, useState } from "react";
import "./index.css";
import { baseURL, request } from "../../utils/axiosClient";
import {
  Column,
  Game,
  GameState,
  Piece,
  Row,
  SquareContext,
} from "../../types";
import SquareComponent from "../Square";
import { findPieceBySquare } from "../../utils/moves";
import { letters as files, numbers as ranks } from "../../utils/squares";
import axios, { AxiosError } from "axios";

interface ChessBoardProps {
  reverse: boolean;
  isPractice: boolean;
  game: Game;
}

const ChessBoard: FunctionComponent<ChessBoardProps> = ({ reverse, game }) => {
  let letters = [...files];
  let numbers = [...ranks].reverse();

  const [pieces, setPieces] = useState<Piece[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isBlackTurn, setBlackTurn] = useState<boolean>(false);
  const [result, setResult] = useState<GameState>(null);

  useEffect(() => {
    // console.log(game);

    if (game) {
      console.log("setting pieces");
      setPieces(game.pieces);
    }
  }, []);

  useEffect(() => {
    console.log("pcs", pieces);
  }, [pieces]);

  function updateTurn() {}

  // TO-DO reduce complexity, this is repeated 64 times on each render
  const handleClick = async (squareContext: SquareContext) => {
    if (squareContext.piece && !selectedPiece) {
      setSelectedPiece(squareContext.piece);
      return;
    }

    if (selectedPiece) {
      axios
        .post<Game>(`${baseURL}/chessboard/move`, {
          piece: selectedPiece,
          target: { file: squareContext.file, rank: squareContext.rank },
          gameId: game.id,
          playerWhiteId: "1",
          playerBlackId: "2",
        })
        .then(({ data }) => {
          console.log(data);
          setPieces(data.pieces);
          setBlackTurn(data.moves.length % 2 === 1);
          setResult(data.result ?? null);
        })
        .catch((error) => {
          console.log(`Error making move: ${error.message}`);
        })
        .finally(() => {
          console.log("finally");
          setSelectedPiece(null);
        });
    }
  };

  return (
    <>
      {error ?? null}
      {result}
      {isBlackTurn ? "Black's turn" : "White's turn"}
      <div className="chessboard">
        {(reverse ? [...numbers].reverse() : numbers).map((number, i) => {
          return (
            <>
              <div key={i} className="label rank">
                {number}
              </div>
              {(reverse ? [...letters].reverse() : letters).map((letter) => {
                return (
                  <SquareComponent
                    key={letter + number}
                    file={letter as Column}
                    rank={number as Row}
                    piece={findPieceBySquare(pieces, letter, number)}
                    onClick={handleClick}
                  />
                );
              })}
            </>
          );
        })}

        <div className="corner"></div>
        {(reverse ? [...letters].reverse() : letters).map((letter) => {
          return (
            <div key={letter} className="label file">
              {letter.toLocaleUpperCase()}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ChessBoard;
