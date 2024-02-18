import { Game, Piece, Square } from "@chessboard/types";
import { CalcMove, MakeMoveContext } from "dto";
import {
  getDiagonalMoves,
  getHorizontalAndVerticalMoves,
  getLMoves,
  getPawnMoves,
} from "./moves";
import { squareHasPiece } from "./moveUtils";

export function makeMove(piece: Piece, target: Square, game: Game): Game {
  // const { piece, target, state } = ctx;

  console.log("piece", piece);
  console.log("target", target);
  console.log("blackTurn & color piece", game.isBlackTurn, piece.color);

  if (game.isBlackTurn !== (piece.color === "black")) {
    console.log(`${piece.color}'s turn`);
    return game;
  }
  console.log(`not ${piece.color}'s turn`);

  const options: CalcMove = {
    start: { rank: piece.rank, file: piece.file },
    pieces: game.pieces,
    color: piece.color,
  };

  let moves: Square[] = [];
  let hasMoved: boolean;
  let updatedPieces = [...game.pieces];
  const targetPiece = squareHasPiece(target, game.pieces);

  switch (piece.type) {
    case "Pawn":
      moves = getPawnMoves(options);
      break;
    case "King":
      moves = [
        ...getDiagonalMoves({ ...options, adjacentOnly: true }),
        ...getHorizontalAndVerticalMoves({ ...options, adjacentOnly: true }),
      ];
      break;
    case "Bishop":
      moves = getDiagonalMoves(options);
      break;
    case "Queen":
      moves = [
        ...getDiagonalMoves(options),
        ...getHorizontalAndVerticalMoves(options),
      ];
      break;
    case "Knight":
      moves = getLMoves(options);
      break;
    case "Rook":
      moves = getHorizontalAndVerticalMoves(options);
      break;
  }
  // console.log("moves", moves);

  if (!moves.find((m) => m.file === target.file && m.rank === target.rank)) {
    return game;
  }

  // Check if anything is captured
  if (targetPiece) {
    updatedPieces = updatedPieces.filter(
      (p) => !(p.file === targetPiece.file && p.rank === targetPiece.rank)
    );
  }
  console.log(
    "old",
    updatedPieces[
      updatedPieces.findIndex(
        (p) => p.file === piece.file && p.rank === piece.rank
      )
    ]
  );

  const updPiece = (updatedPieces[
    updatedPieces.findIndex(
      (p) => p.file === piece.file && p.rank === piece.rank
    )
  ] = { ...piece, ...target });

  console.log("upd p ", updPiece);

  if (
    updatedPieces[
      updatedPieces.findIndex(
        (p) => p.file === piece.file && p.rank === piece.rank
      )
    ]
  ) {
    console.log("hasn't moved");
    // hasMoved = false;
  } else {
    console.log("has moved");
    hasMoved = !game.isBlackTurn;
  }

  const updatedGame: Game = {
    ...game,
    pieces: updatedPieces,
    isBlackTurn: hasMoved,
  };

  // console.log("updatedP", updatedPieces);
  return updatedGame;

  // check if check
  // .....
}
