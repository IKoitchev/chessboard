import { Color, Piece, Game, Square, Move } from "@chessboard/types";
import { generatePieces } from "./initBoard";
import { Game as GameModel } from "../models/game";
import {
  getDiagonalMoves,
  getHorizontalAndVerticalMoves,
  getLMoves,
  getPawnMoves,
} from "./moves";
import { CalcMove } from "../dto";

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

export function opposingColor(piece: Piece): Color {
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
      opposingColor(piece)
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

/**
 * Check if after a move, the moving player is in check
 *
 * @param pieces Pieces after the move is attempted
 * @param color Color of the player making the move
 */
export function checkIfCheck(pieces: Piece[], color: Color) {
  const king: Piece = pieces.find(
    (p) => p.type === "King" && p.color === color
  );

  if (!king) {
    throw new Error(`Error finding the ${color} king`);
  }

  for (const piece of pieces) {
    if (piece.color === opposingColor(king)) {
      const options: CalcMove = {
        start: { rank: piece.rank, file: piece.file },
        pieces: pieces,
        color: piece.color,
      };
      const moves = legalMoves(piece, options);

      if (moves.find((m) => m.file === king.file && m.rank === king.rank)) {
        console.log("piece", piece);
        return true;
      }
    }
  }
  return false;
}

export function legalMoves(piece: Piece, options: CalcMove): Square[] {
  let legalMoves: Square[] = [];

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

  return legalMoves;
}
