import { Game, Move, Piece, Square } from "@chessboard/types";
import { CalcMove, Promotable } from "src/dto";

import {
  squareHasPiece,
  legalMoves as getLegalMoves,
  checkIfCheck,
  movePieceTo,
  makePromotion,
} from "./moveUtils";
import { findEnPassant, getCastleSquares } from "./moves";

export function makeMove(
  piece: Piece,
  target: Square,
  game: Game,
  promoteTo?: Promotable
): Game {
  const options: CalcMove = {
    start: { rank: piece.rank, file: piece.file },
    pieces: game.pieces,
    color: piece.color,
  };

  let updatedPieces = [...game.pieces];

  const targetPiece = squareHasPiece(target, game.pieces);

  const legalMoves = getLegalMoves(piece, options);

  const enPassantMove = findEnPassant(game, piece);

  const castleOptions = getCastleSquares(game, piece);

  // castle
  if (
    castleOptions.find(
      (sq) => sq.file === target.file && sq.rank === target.rank
    )
  ) {
    updatedPieces = movePieceTo(game.pieces, piece, target);
    // updatedPieces[
    //   updatedPieces.findIndex(
    //     (p) => p.file === piece.file && p.rank === piece.rank
    //   )
    // ] = { ...piece, ...target };

    const short = target.file === "g";

    const rookIndex = updatedPieces.findIndex(
      (p) =>
        p.type === "Rook" &&
        p.rank === piece.rank &&
        p.file === (short ? "h" : "a")
    );
    const rook = updatedPieces[rookIndex];

    // updatedPieces[rookIndex] = {
    //   ...updatedPieces[rookIndex],
    //   rank: target.rank,
    //   file: short ? "f" : "c",
    // };

    updatedPieces = movePieceTo(updatedPieces, rook, {
      rank: target.rank,
      file: short ? "f" : "c",
    });
  }
  // enpassant
  else if (
    enPassantMove &&
    enPassantMove.file === target.file &&
    enPassantMove.rank === target.rank
  ) {
    // move the pawn
    updatedPieces[
      updatedPieces.findIndex(
        (p) => p.file === piece.file && p.rank === piece.rank
      )
    ] = { ...piece, ...target };

    //remove the captured pawn

    updatedPieces = updatedPieces.filter(
      (p) => !(p.file === enPassantMove.file && p.rank === piece.rank)
    );

    if (checkIfCheck(updatedPieces, piece.color)) {
      return game;
    }
  }
  //Normal moves
  else {
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

    let afterMove = { ...game, pieces: updatedPieces };
    if (piece.type === "Pawn") {
      afterMove = makePromotion({ ...afterMove }, piece, promoteTo);
      updatedPieces = afterMove.pieces;
    }
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
