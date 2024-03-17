import { Color, Piece, Game, Square, Move } from "@chessboard/types";
import { generatePieces } from "./initBoard";
import { Game as GameModel } from "../models/game";

/**
 * Check if there is a piece on a given square
 * If color is provided, check if there is a piece of the same color
 */

export function squareHasPiece(square: Square, pieces: Piece[], color?: Color) {
  return pieces.find(
    (p) =>
      p.file === square.file &&
      p.rank === square.rank &&
      (color ? color === p.color : true)
  );
}

export function getOpposingColor(piece: Piece): Color {
  return piece.color === "white" ? "black" : "white";
}

/**
 * Replay the moves of a game and get the current position
 */
export function getCurrentPosition(game: GameModel): Game {
  let current: Piece[] = generatePieces();

  const { playerBlackId, playerWhiteId, id, moves } = game;

  console.log("moveUtils.ts", moves);

  if (!moves) {
    return {
      pieces: current,
      playerBlackId: playerBlackId,
      playerWhiteId: playerWhiteId,
      id,
      moves,
    };
  }

  for (const move of moves) {
    const piece: Piece = JSON.parse(move.piece) as Piece;

    const targetPiece = squareHasPiece(
      { file: move.targetFile, rank: move.targetRank },
      current,
      getOpposingColor(piece)
    );

    // Remove target piece
    if (targetPiece) {
      current = current.filter(
        (p) => !(p.file === targetPiece.file && p.rank === targetPiece.rank)
      );
    }
    const pieceIndex = current.findIndex(
      (p) => p.file === piece.file && p.rank === piece.rank
    );
    console.log("before move", current[pieceIndex]);

    current[pieceIndex] = {
      ...(piece as Piece),
      file: move.targetFile,
      rank: move.targetRank,
    };

    console.log("after move", current[pieceIndex]);
  }

  return {
    pieces: current,
    playerBlackId: playerBlackId,
    playerWhiteId: playerWhiteId,
    id,
    moves,
  };
}
