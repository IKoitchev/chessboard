import { Square } from "@chessboard/types";
import { CalcMove, MakeMoveContext } from "dto";
import {
  getDiagonalMoves,
  getHorizontalAndVerticalMoves,
  getLMoves,
  getPawnMoves,
} from "./moves";
import { squareHasPiece } from "./moveUtils";

export function makeMove(ctx: MakeMoveContext) {
  const { piece, target, state } = ctx;

  console.log("piece", piece);
  console.log("target", target);

  const options: CalcMove = {
    start: { rank: piece.rank, file: piece.file },
    pieces: state.pieces,
    color: piece.color,
  };

  let moves: Square[] = [];

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
  console.log("moves", moves);

  if (!moves.find((m) => m.file === target.file && m.rank === target.rank)) {
    return state.pieces;
  }

  const targetPiece = squareHasPiece(target, state.pieces);

  let updatedPieces = [...state.pieces];

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

  // console.log("updated", updatedPieces[updatedPieces.indexOf(piece)]);
  console.log("updatedP", updatedPieces);
  return updatedPieces;

  // check if check
  // .....
}
