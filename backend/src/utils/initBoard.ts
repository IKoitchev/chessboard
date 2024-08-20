import { Board, Rank, File, Piece } from "@chessboard/types";
import { Bishop, King, Knight, Pawn, Queen, Rook } from "../types/Pieces";
import { Squares } from "./squares";

const numbers: Rank[] = ["1", "2", "3", "4", "5", "6", "7", "8"];
const letters: File[] = ["a", "b", "c", "d", "e", "f", "g", "h"];

export function initBoard(): Board {
  // create squares
  const pieces = generatePieces();

  const board: Board = {
    pieces,
  };

  return board;
}

export function generatePieces(): Piece[] {
  const pieces: Piece[] = [];

  // Pawns
  for (const file of letters) {
    const whitePawn = new Pawn(
      Squares[letters.indexOf(file)][numbers.indexOf("2")],
      "white"
    );
    const blackPawn = new Pawn(
      Squares[letters.indexOf(file)][numbers.indexOf("7")],
      "black"
    );
    pieces.push(whitePawn, blackPawn);
  }

  // Rook
  const whiteRook1 = new Rook(
    Squares[letters.indexOf("a")][numbers.indexOf("1")],
    "white"
  );
  const whiteRook2 = new Rook(
    Squares[letters.indexOf("h")][numbers.indexOf("1")],
    "white"
  );
  const blackRook1 = new Rook(
    Squares[letters.indexOf("a")][numbers.indexOf("8")],
    "black"
  );
  const blackRook2 = new Rook(
    Squares[letters.indexOf("h")][numbers.indexOf("8")],
    "black"
  );

  // Knight
  const whiteKnight1 = new Knight(
    Squares[letters.indexOf("b")][numbers.indexOf("1")],
    "white"
  );
  const whiteKnight2 = new Knight(
    Squares[letters.indexOf("g")][numbers.indexOf("1")],
    "white"
  );
  const blackKnight1 = new Knight(
    Squares[letters.indexOf("b")][numbers.indexOf("8")],
    "black"
  );
  const blackKnight2 = new Knight(
    Squares[letters.indexOf("g")][numbers.indexOf("8")],
    "black"
  );

  // Bishop
  const whiteBishop1 = new Bishop(
    Squares[letters.indexOf("c")][numbers.indexOf("1")],
    "white"
  );
  const whiteBishop2 = new Bishop(
    Squares[letters.indexOf("f")][numbers.indexOf("1")],
    "white"
  );
  const blackBishop1 = new Bishop(
    Squares[letters.indexOf("c")][numbers.indexOf("8")],
    "black"
  );
  const blackBishop2 = new Bishop(
    Squares[letters.indexOf("f")][numbers.indexOf("8")],
    "black"
  );

  // King
  const whiteKing = new King(
    Squares[letters.indexOf("e")][numbers.indexOf("1")],
    "white"
  );
  const blackKing = new King(
    Squares[letters.indexOf("e")][numbers.indexOf("8")],
    "black"
  );
  // Queen
  const whiteQueen = new Queen(
    Squares[letters.indexOf("d")][numbers.indexOf("1")],
    "white"
  );
  const blackQueen = new Queen(
    Squares[letters.indexOf("d")][numbers.indexOf("8")],
    "black"
  );

  pieces.push(
    whiteRook1,
    whiteRook2,
    whiteKnight1,
    whiteKnight2,
    whiteBishop1,
    whiteBishop2,
    whiteKing,
    whiteQueen,
    blackRook1,
    blackRook2,
    blackKnight1,
    blackKnight2,
    blackBishop1,
    blackBishop2,
    blackKing,
    blackQueen
  );

  return pieces;
}
