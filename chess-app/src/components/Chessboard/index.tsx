import { type FunctionComponent, useEffect, useState } from "react";
import "./index.css";
import { baseURL } from "../../utils/axiosClient";
import {
  type Game,
  type GameState,
  type Piece,
  type Square,
  type SquareContext,
} from "../../types";
import SquareComponent from "../Square";
import { findPieceBySquare } from "../../utils/moves";
import { letters as files, numbers as ranks } from "../../utils/squares";
import axios, { type AxiosError } from "axios";
import { DndContext, type DragMoveEvent } from "@dnd-kit/core";

interface ChessBoardProps {
  reverse: boolean;
  isPractice: boolean;
  game: Game;
  changeTurn: (isBlackTurn: boolean) => void;
}

const ChessBoard: FunctionComponent<ChessBoardProps> = ({
  reverse,
  game,
  changeTurn,
  isPractice,
}) => {
  const letters = [...files];
  const numbers = [...ranks].reverse();

  const [pieces, setPieces] = useState<Piece[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const [error] = useState<string | null>(null);
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

    if (!target) {
      return;
    }

    if (movingPiece.file === target.file && movingPiece.rank === target.rank) {
      setSelectedPiece(movingPiece);
      return;
    }

    console.log("dragging", movingPiece, target);

    const index = pieces.findIndex(
      (p) => p.file === movingPiece.file && p.rank === movingPiece.rank
    );

    // Update the UI before the request to avoid glitching of pieces
    const piecesCopy = [...pieces];
    piecesCopy[index] = { ...movingPiece, ...target };
    console.log(piecesCopy);
    setPieces(piecesCopy);

    move(movingPiece, target);
    setSelectedPiece(null);
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
        changeTurn(data.moves.length % 2 === 1);
        setResult(data.result ?? null);
      })
      .catch((error) => {
        console.log(`Error making move: ${error as AxiosError}`);
        // Revert pieces to the last state received from the server
        // Because they are set preemtively before the request
        setPieces([...pieces]);
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

      <DndContext
        onDragEnd={async (event) => {
          await dragMove(event);
        }}
      >
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
                      file={letter}
                      rank={number}
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
