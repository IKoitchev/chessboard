import { FunctionComponent, useEffect, useState } from "react";
import "./index.css";
import { baseURL, request } from "../../utils/axiosClient";
import {
  Column,
  Game,
  GameState,
  Piece,
  Row,
  Square,
  SquareContext,
} from "../../types";
import SquareComponent from "../Square";
import { findPieceBySquare } from "../../utils/moves";
import { letters as files, numbers as ranks } from "../../utils/squares";
import axios, { AxiosError } from "axios";
import { DndContext, DragMoveEvent } from "@dnd-kit/core";

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
    if (game) {
      console.log("setting pieces");
      setPieces(game.pieces);
    }
  }, []);

  useEffect(() => {
    console.log("pcs", pieces);
  }, [pieces]);
  useEffect(() => {
    console.log(
      selectedPiece
        ? `${selectedPiece.color} ${selectedPiece.type} ${selectedPiece.file}${selectedPiece.rank}`
        : "not",
      "selected"
    );
  }, [selectedPiece]);
  // TO-DO reduce complexity, this is repeated 64 times on each render
  const handleClick = async (squareContext: SquareContext) => {
    if (squareContext.piece) {
      setSelectedPiece(squareContext.piece);
      return;
    }

    if (selectedPiece) {
      move(selectedPiece, squareContext);
    }
  };
  const dragMove = async (event: DragMoveEvent) => {
    const movingPiece = event.active.data.current as Piece;
    const target = event.over?.data.current as Square;

    if (movingPiece.file === target.file && movingPiece.rank === target.rank) {
      setSelectedPiece(movingPiece);
      return;
    }

    console.log("dragging", movingPiece, target);
    move(movingPiece, target);
  };

  function move(piece: Piece, target: Square) {
    if (piece.file === target.file && piece.rank === target.rank) {
      return;
    }

    console.log("piece", piece);
    axios
      .post<Game>(`${baseURL}/chessboard/move`, {
        piece,
        target,
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
        console.log(`Error making move: ${error as AxiosError}`);
      })
      .finally(() => {
        console.log("finally");
        setSelectedPiece(null);
      });
  }
  return (
    <>
      {error ?? null}
      {result}
      {isBlackTurn ? "Black's turn" : "White's turn"}
      <DndContext onDragEnd={(event) => dragMove(event)}>
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
      </DndContext>
    </>
  );
};

export default ChessBoard;
