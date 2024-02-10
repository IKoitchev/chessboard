import { Rank, File, Color, Square } from "@chessboard/types";

export const numbers: Rank[] = ["1", "2", "3", "4", "5", "6", "7", "8"];
export const letters: File[] = ["a", "b", "c", "d", "e", "f", "g", "h"];

export const Squares = squares();

function squares() {
  let color: Color = "black";
  let squares: Square[][] = [];

  for (const file of letters) {
    squares[letters.indexOf(file)] = [];
    for (const rank of numbers) {
      const square: Square = { rank, file };

      squares[letters.indexOf(file)][numbers.indexOf(rank)] = square;
    }
  }

  return squares;
}
