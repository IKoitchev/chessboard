import { Color, Piece, Game, Square, GameState } from "@chessboard/types";
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

export function opposingColor(obj: Piece | Color): Color {
  if (typeof obj === "string") return obj === "white" ? "black" : "white";

  if ("color" in obj) {
    return obj.color === "white" ? "black" : "white";
  }
}

export function squareOf(piece: Piece): Square {
  return { file: piece.file, rank: piece.rank };
}

/**
 * Replay the moves of a game and get the current position
 *
 * TO-DO: should probably not expect a model
 */
export function getCurrentPosition(game: GameModel): Game {
  let current: Piece[] = generatePieces();

  const { playerBlackId, playerWhiteId, id, moves } = game;

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

    current[pieceIndex] = {
      ...piece,
      file: move.targetFile,
      rank: move.targetRank,
    };

    //check for castle

    if (
      piece.type === "King" &&
      piece.file === "e" &&
      ["c", "g"].includes(move.targetFile)
    ) {
      const shortCastle = move.targetFile === "g";
      const rookIndex = current.findIndex(
        (p) => p.file === (shortCastle ? "h" : "a") && p.rank === piece.rank
      );
      current[rookIndex] = {
        ...current[rookIndex],
        file: shortCastle ? "f" : "d",
      };
    }
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
        return true;
      }
    }
  }
  return false;
}

/**
 * Check if after a move, the opposing to the moving player is in mate/stalemate
 *
 * @param pieces Pieces in the current board
 * @param playerColor Color of the player that is to be mated or stalemated
 */
export function checkIfMateOrStalemate(
  pieces: Piece[],
  playerColor: Color
): GameState {
  const nextLegalMoves: Square[] = [];

  // Get all possible moves for the player whose turn is coming
  for (const piece of pieces) {
    if (piece.color === playerColor) {
      const start = squareOf(piece);

      const options: CalcMove = { start, pieces, color: piece.color };

      let moves = legalMoves(piece, options);

      if (moves && moves.length > 0) {
        moves = moves.filter((move) => {
          let updatedPieces = [...pieces];
          const targetPiece = squareHasPiece(move, pieces);

          if (targetPiece) {
            updatedPieces = updatedPieces.filter(
              (p) =>
                !(p.file === targetPiece.file && p.rank === targetPiece.rank)
            );
          }
          updatedPieces[
            updatedPieces.findIndex(
              (p) => p.file === piece.file && p.rank === piece.rank
            )
          ] = { ...piece, ...move };

          // To check if the move would be legal
          if (checkIfCheck(updatedPieces, piece.color)) {
            return false;
          }
          return true;
        });
      }
      nextLegalMoves.push(...moves);
    }
  }

  console.log(
    "state",
    getGameState(
      nextLegalMoves.length > 0,
      checkIfCheck(pieces, playerColor),
      playerColor
    )
  );

  return getGameState(
    nextLegalMoves.length > 0,
    checkIfCheck(pieces, playerColor),
    playerColor
  );
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
/**
 *
 * Calculate whether the next player to make a move is in check, mate, or stalemate
 *
 * @param hasMoves Whether there are legal moves left for the next player to make a move
 * @param isCheck Wheter the next player to make a move is in check currently
 * @param color Color of the next player to make a move
 *
 * @returns Result of type `GameState`, `null` if not in check and has moves
 */
export function getGameState(
  hasMoves: boolean,
  isCheck: boolean,
  color: Color
): GameState {
  if (hasMoves && isCheck) {
    return `${color} in check`;
  } else if (hasMoves && !isCheck) {
    return null;
  } else if (!hasMoves && isCheck) {
    return `${opposingColor(color)} win`;
  } else {
    return "stalemate";
  }
}

/**
 * Validate whether the correct player and piece color is being moved
 */
export function validTurnOrder(
  game: Game,
  pieceColor: Color,
  playerId: string
): boolean {
  const failConditions: boolean[] = [
    game.moves.length % 2 === 0 && pieceColor === "black",
    game.moves.length % 2 === 1 && pieceColor === "white",
    // should be enabled later
    // game.moves.length % 2 === 0 && game.playerWhiteId !== playerId,
    // game.moves.length % 2 === 1 && game.playerBlackId !== playerId,
  ];

  if (failConditions.some(Boolean)) return false;

  return true;
}
