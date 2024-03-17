import { Game, Move, Piece, Square } from "@chessboard/types";
import { CalcMove, MakeMoveContext } from "src/dto";
import {
  getDiagonalMoves,
  getHorizontalAndVerticalMoves,
  getLMoves,
  getPawnMoves,
} from "./moves";
import { squareHasPiece } from "./moveUtils";

type MoveProps = { piece: Piece; target: Square; game: Game };

export function makeMove(piece: Piece, target: Square, game: Game): Game {
  console.log("piece", piece);
  console.log("target", target);
  console.log("moves number & color piece", game.moves.length, piece.color);

  // if (game.isBlackTurn !== (piece.color === "black")) {
  //   console.log(`${piece.color}'s turn`);
  //   return game;
  // }
  // console.log(`not ${piece.color}'s turn`);

  const options: CalcMove = {
    start: { rank: piece.rank, file: piece.file },
    pieces: game.pieces,
    color: piece.color,
  };

  let legalMoves: Square[] = [];
  let hasMoved: boolean = false;
  let updatedPieces = [...game.pieces];
  const targetPiece = squareHasPiece(target, game.pieces);

  switch (piece.type) {
    case "Pawn":
      legalMoves = getPawnMoves(options);
      break;
    case "King":
      legalMoves = [
        ...getDiagonalMoves({ ...options, adjacentOnly: true }),
        ...getHorizontalAndVerticalMoves({ ...options, adjacentOnly: true }),
      ];
      break;
    case "Bishop":
      legalMoves = getDiagonalMoves(options);
      break;
    case "Queen":
      legalMoves = [
        ...getDiagonalMoves(options),
        ...getHorizontalAndVerticalMoves(options),
      ];
      break;
    case "Knight":
      legalMoves = getLMoves(options);
      break;
    case "Rook":
      legalMoves = getHorizontalAndVerticalMoves(options);
      break;
  }

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

  // check if check
  // .....
}
