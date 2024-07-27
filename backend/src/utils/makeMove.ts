import { Game, Move, Piece, Square } from "@chessboard/types";
import { CalcMove } from "src/dto";

import {
  squareHasPiece,
  legalMoves as getLegalMoves,
  checkIfCheck,
} from "./moveUtils";

export function makeMove(piece: Piece, target: Square, game: Game): Game {
  const options: CalcMove = {
    start: { rank: piece.rank, file: piece.file },
    pieces: game.pieces,
    color: piece.color,
  };

  let updatedPieces = [...game.pieces];
  const targetPiece = squareHasPiece(target, game.pieces);

  const legalMoves = getLegalMoves(piece, options);

  if (
    !legalMoves.find((m) => m.file === target.file && m.rank === target.rank)
  ) {
    return game;
  }

  // Check if anything is captured
  if (targetPiece) {
    updatedPieces = updatedPieces.filter(
      (p) => !(p.file === targetPiece.file && p.rank === targetPiece.rank)
    );
  }

  updatedPieces[
    updatedPieces.findIndex(
      (p) => p.file === piece.file && p.rank === piece.rank
    )
  ] = { ...piece, ...target };

  // If piece is on the same square
  if (
    updatedPieces[
      updatedPieces.findIndex(
        (p) => p.file === piece.file && p.rank === piece.rank
      )
    ]
  ) {
    return game;
  }

  // If moving player is in check, move is not legal
  if (checkIfCheck(updatedPieces, piece.color)) {
    return game;
  }

  // This is not used, but we need to create a move here
  // Because the controller checks whether the number of moves has changed
  // this object is not sent to the frontend nor saved in the db
  const newMove: Move = {
    gameId: game.id,
    id: null,
    piece: JSON.stringify(piece),
    targetFile: target.file,
    targetRank: target.rank,
  };

  const updatedGame: Game = {
    ...game,
    pieces: updatedPieces,
    moves: [...game.moves, newMove],
  };

  return updatedGame;
}
