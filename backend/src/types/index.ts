declare module "@chessboard/types" {
  type Board = {
    pieces: Piece[];
  };

  type Square = {
    rank: Rank;
    file: File;
    piece?: Piece;
  };

  type Color = "black" | "white";

  type Rank = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";

  type File = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h";

  type Piece = {
    rank: Rank;
    file: File;
    color: Color;
    points: number;
    type: PieceType;
  };
  type PieceType = "Pawn" | "King" | "Bishop" | "Queen" | "Knight" | "Rook";

  type Game = {
    id: string;
    playerWhite: Player;
    playerBlack: Player;
    isBlackTurn: boolean;
    pieces: Piece[];
  };
  type Player = {
    id: string;
  };
}
