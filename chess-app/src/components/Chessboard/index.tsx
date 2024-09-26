import { type FunctionComponent, useEffect, useState } from "react";
import "./index.css";
import {
  Move,
  Promotable,
  type Game,
  type GameState,
  type Piece,
  type Square,
  type SquareContext,
} from "../../types";
import SquareComponent from "../Square";
import { findPieceBySquare } from "../../utils/moves";
import { letters as files, numbers as ranks } from "../../utils/squares";
import { DndContext, type DragMoveEvent } from "@dnd-kit/core";
import { useWebSocket } from "../WsProvdier";
import { useUser } from "../UserProvider";

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
  const [result, setResult] = useState<GameState>(null);
  const [moves, setMoves] = useState<Move[]>([]);
  const [promSquare, setPromSquare] = useState<Square | null>(null);

  // The moving pawn, before the move
  const [promPiece, setPromPiece] = useState<Piece | null>(null);

  const { sendMessage, isConnected, messages } = useWebSocket();
  const { getAccessToken, isLoggedIn } = useUser();

  useEffect(() => {
    console.log("pcs", pieces);
  }, [pieces]);

  useEffect(() => {
    console.log("changed", game);
    console.log("setting pieces");
    setPieces(game.pieces);
  }, [game]);

  useEffect(() => {
    console.log("promSquare", promSquare);
  }, [promSquare]);

  useEffect(() => {
    if (messages && messages.length > 0) {
      const latest = JSON.parse(messages[messages.length - 1]);

      console.log(latest.pieces.length);

      setPieces(latest.pieces);
      if (latest.moves && latest.moves.length > 0) {
        setMoves(latest.moves);
      }
      // Do some errorhandling
    }
  }, [messages]);

  useEffect(() => {
    console.log(
      selectedPiece
        ? `${selectedPiece.color} ${selectedPiece.type} ${selectedPiece.file}${selectedPiece.rank}`
        : "not",
      "selected"
    );
  }, [selectedPiece]);

  const handleClick = async (squareContext: SquareContext) => {
    console.log("handleclick");
    if (squareContext.piece) {
      setSelectedPiece(squareContext.piece);
      return;
    }

    if (selectedPiece) {
      move(selectedPiece, squareContext);
    }
  };

  const handleSelectProm = async (promoteTo: Promotable) => {
    console.log(promoteTo);

    debugger;

    isLoggedIn
      ? sendMessage({
          piece: selectedPiece!,
          target: promSquare!,
          jwt: getAccessToken(),
          promoteTo,
        })
      : sendMessage({
          piece: selectedPiece!,
          target: promSquare!,
          jwt: "",
          game: { ...game, moves, pieces },
          promoteTo,
        });

    setSelectedPiece(null);
  };

  const dragMove = async (event: DragMoveEvent) => {
    console.log("dragMove");
    const movingPiece = event.active.data.current as Piece;
    const target = event.over?.data.current as Square;
    // debugger;
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
    console.log("mp", movingPiece);
    piecesCopy[index] = { ...movingPiece, ...target };
    console.log(piecesCopy);
    setPieces(piecesCopy);
    setSelectedPiece(movingPiece);

    move(movingPiece, target);
    console.log("selected before move", selectedPiece);

    console.log(movingPiece?.type, movingPiece?.color, target.rank);

    if (
      !(
        movingPiece?.type === "Pawn" &&
        ((movingPiece?.color === "black" && target.rank === "1") ||
          (movingPiece?.color === "white" && target.rank === "8"))
      )
    ) {
      setSelectedPiece(null);
    }
  };

  function move(piece: Piece, target: Square) {
    console.log("move");
    if (piece.file === target.file && piece.rank === target.rank) {
      return;
    }

    console.log("piece", piece);

    // Prom
    if (
      (piece.color === "black" &&
        target.rank === "1" &&
        piece.type === "Pawn") ||
      (piece.color === "white" && target.rank === "8" && piece.type === "Pawn")
    ) {
      setPromSquare({ file: piece.file, rank: target.rank });
    } else {
      isLoggedIn
        ? sendMessage({ piece, target, jwt: getAccessToken() })
        : sendMessage({
            piece,
            target,
            jwt: "",
            game: { ...game, moves, pieces },
          });
    }
  }
  return (
    <>
      {result}
      {isConnected ? (
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
                  {(reverse ? [...letters].reverse() : letters).map(
                    (letter) => {
                      return (
                        <SquareComponent
                          key={letter + number}
                          file={letter}
                          rank={number}
                          piece={findPieceBySquare(pieces, letter, number)}
                          onClick={handleClick}
                          isPromoting={
                            letter === promSquare?.file &&
                            number === promSquare.rank &&
                            findPieceBySquare(pieces, letter, number)?.type ===
                              "Pawn"
                          }
                          onSelectProm={(promoteTo) =>
                            handleSelectProm(promoteTo)
                          }
                        />
                      );
                    }
                  )}
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
      ) : null}
    </>
  );
};

export default ChessBoard;
