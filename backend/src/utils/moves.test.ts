import { Game, Move, Piece, Square } from "@chessboard/types";
import { describe, expect, it } from "vitest";
import {
  getCastleSquares,
  getDiagonalMoves,
  getHorizontalAndVerticalMoves,
  getLMoves,
  getPawnMoves,
} from "./moves";
import { CalcMove } from "../dto";
import { Knight, Pawn, Rook } from "../types/Pieces";
import { initBoard } from "./initBoard";

describe("Moves", () => {
  describe("Vertical and horizontal", () => {
    it("should return all squares on the file A and rank 1", () => {
      const piece: Piece = {
        file: "a",
        rank: "1",
        color: "white",
        points: 5,
        type: "Rook",
      };

      const moves = getHorizontalAndVerticalMoves({
        start: { file: piece.file, rank: piece.rank },
        pieces: [],
        color: piece.color,
      });
      const expected: Square[] = [
        { file: "a", rank: "2" },
        { file: "a", rank: "3" },
        { file: "a", rank: "4" },
        { file: "a", rank: "5" },
        { file: "a", rank: "6" },
        { file: "a", rank: "7" },
        { file: "a", rank: "8" },

        { file: "b", rank: "1" },
        { file: "c", rank: "1" },
        { file: "d", rank: "1" },
        { file: "e", rank: "1" },
        { file: "f", rank: "1" },
        { file: "g", rank: "1" },
        { file: "h", rank: "1" },
      ];

      expect(moves).toEqual(expect.arrayContaining(expected));
    });
    it("should return all squares on the file H and rank 2", () => {
      const piece: Piece = {
        file: "h",
        rank: "8",
        color: "black",
        points: 5,
        type: "Rook",
      };

      const moves = getHorizontalAndVerticalMoves({
        start: { file: piece.file, rank: piece.rank },
        pieces: [],
        color: piece.color,
      });
      const expected: Square[] = [
        { file: "h", rank: "2" },
        { file: "h", rank: "3" },
        { file: "h", rank: "4" },
        { file: "h", rank: "5" },
        { file: "h", rank: "6" },
        { file: "h", rank: "7" },
        { file: "h", rank: "1" },

        { file: "b", rank: "8" },
        { file: "c", rank: "8" },
        { file: "d", rank: "8" },
        { file: "e", rank: "8" },
        { file: "f", rank: "8" },
        { file: "g", rank: "8" },
        { file: "a", rank: "8" },
      ];

      expect(moves).toEqual(expect.arrayContaining(expected));
    });
    it("should capture pieces in all directions h/v", () => {
      const piece: Piece = {
        file: "e",
        rank: "4",
        color: "white",
        points: 5,
        type: "Rook",
      };
      const forCapturing: Piece[] = [
        {
          file: "e",
          rank: "5",
          color: "black",
          points: 5,
          type: "Rook",
        },
        {
          file: "h",
          rank: "4",
          color: "black",
          points: 5,
          type: "Rook",
        },
        {
          file: "d",
          rank: "4",
          color: "black",
          points: 5,
          type: "Rook",
        },
        {
          file: "e",
          rank: "1",
          color: "black",
          points: 5,
          type: "Rook",
        },
      ];

      const moves = getHorizontalAndVerticalMoves({
        start: { file: piece.file, rank: piece.rank },
        pieces: forCapturing,
        color: piece.color,
      });

      const expected: Square[] = [
        { file: "e", rank: "5" },
        { file: "e", rank: "3" },
        { file: "e", rank: "2" },
        { file: "e", rank: "1" },

        { file: "d", rank: "4" },
        { file: "f", rank: "4" },
        { file: "g", rank: "4" },
        { file: "h", rank: "4" },
      ];

      expect(moves).toEqual(expect.arrayContaining(expected));
    });
    it("should be blocked by same color pieces in all directions", () => {
      const piece: Piece = {
        file: "e",
        rank: "4",
        color: "black",
        points: 5,
        type: "Rook",
      };
      const forCapturing: Piece[] = [
        {
          file: "e",
          rank: "5",
          color: "black",
          points: 5,
          type: "Rook",
        },
        {
          file: "h",
          rank: "4",
          color: "black",
          points: 5,
          type: "Rook",
        },
        {
          file: "d",
          rank: "4",
          color: "black",
          points: 5,
          type: "Rook",
        },
        {
          file: "e",
          rank: "1",
          color: "black",
          points: 5,
          type: "Rook",
        },
      ];

      const moves = getHorizontalAndVerticalMoves({
        start: { file: piece.file, rank: piece.rank },
        pieces: forCapturing,
        color: piece.color,
      });

      const expected: Square[] = [
        { file: "e", rank: "3" },
        { file: "e", rank: "2" },

        { file: "f", rank: "4" },
        { file: "g", rank: "4" },
      ];

      expect(moves).toEqual(expect.arrayContaining(expected));
    });
  });
  describe("Diagonal", () => {
    it("should return black square diagonals from d4", () => {
      const piece: Piece = {
        file: "d",
        rank: "4",
        color: "white",
        points: 3,
        type: "Bishop",
      };

      const moves = getDiagonalMoves({
        start: { file: piece.file, rank: piece.rank },
        pieces: [],
        color: piece.color,
      });
      const expected: Square[] = [
        { file: "e", rank: "5" },
        { file: "f", rank: "6" },
        { file: "g", rank: "7" },
        { file: "h", rank: "8" },
        { file: "c", rank: "3" },
        { file: "b", rank: "2" },
        { file: "a", rank: "1" },

        { file: "e", rank: "3" },
        { file: "f", rank: "2" },
        { file: "g", rank: "1" },
        { file: "c", rank: "5" },
        { file: "b", rank: "6" },
        { file: "a", rank: "7" },
      ];

      expect(moves).toEqual(expect.arrayContaining(expected));
    });
    it("should return white square diagonals from e4", () => {
      const piece: Piece = {
        file: "e",
        rank: "4",
        color: "white",
        points: 3,
        type: "Bishop",
      };

      const moves = getDiagonalMoves({
        start: { file: piece.file, rank: piece.rank },
        pieces: [],
        color: piece.color,
      });
      const expected: Square[] = [
        { file: "f", rank: "5" },
        { file: "g", rank: "6" },
        { file: "h", rank: "7" },
        { file: "d", rank: "3" },
        { file: "c", rank: "2" },
        { file: "b", rank: "1" },

        { file: "d", rank: "5" },
        { file: "c", rank: "6" },
        { file: "b", rank: "7" },
        { file: "a", rank: "8" },
        { file: "f", rank: "3" },
        { file: "g", rank: "2" },
        { file: "h", rank: "1" },
      ];

      expect(moves).toEqual(expect.arrayContaining(expected));
    });
    it("should capture pieces in all diagonals", () => {
      const piece: Piece = {
        file: "e",
        rank: "4",
        color: "white",
        points: 3,
        type: "Bishop",
      };

      const forCapturing: Piece[] = [
        {
          file: "d",
          rank: "5",
          color: "black",
          points: 5,
          type: "Rook",
        },
        {
          file: "g",
          rank: "6",
          color: "black",
          points: 5,
          type: "Rook",
        },
        {
          file: "h",
          rank: "1",
          color: "black",
          points: 5,
          type: "Rook",
        },
        {
          file: "b",
          rank: "1",
          color: "black",
          points: 5,
          type: "Rook",
        },
      ];

      const moves = getDiagonalMoves({
        start: { file: piece.file, rank: piece.rank },
        pieces: forCapturing,
        color: piece.color,
      });
      const expected: Square[] = [
        { file: "d", rank: "5" },

        { file: "f", rank: "5" },
        { file: "g", rank: "6" },

        { file: "f", rank: "3" },
        { file: "g", rank: "2" },
        { file: "h", rank: "1" },

        { file: "d", rank: "3" },
        { file: "c", rank: "2" },
        { file: "b", rank: "1" },
      ];

      expect(moves).toEqual(expect.arrayContaining(expected));
    });
    it("should be blocked by same color pieces in all diagonals", () => {
      const piece: Piece = {
        file: "e",
        rank: "4",
        color: "black",
        points: 3,
        type: "Bishop",
      };

      const forCapturing: Piece[] = [
        {
          file: "d",
          rank: "5",
          color: "black",
          points: 5,
          type: "Rook",
        },
        {
          file: "g",
          rank: "6",
          color: "black",
          points: 5,
          type: "Rook",
        },
        {
          file: "h",
          rank: "1",
          color: "black",
          points: 5,
          type: "Rook",
        },
        {
          file: "b",
          rank: "1",
          color: "black",
          points: 5,
          type: "Rook",
        },
      ];

      const moves = getDiagonalMoves({
        start: { file: piece.file, rank: piece.rank },
        pieces: forCapturing,
        color: piece.color,
      });
      const expected: Square[] = [
        { file: "f", rank: "5" },

        { file: "f", rank: "3" },

        { file: "d", rank: "3" },
        { file: "c", rank: "2" },
      ];

      expect(moves).toEqual(expect.arrayContaining(expected));
    });
  });
  describe("L shape", () => {
    it("should return all possible (8) moves", () => {
      const piece: Piece = {
        file: "d",
        rank: "4",
        color: "white",
        points: 3,
        type: "Knight",
      };

      const moves = getLMoves({
        start: { file: piece.file, rank: piece.rank },
        pieces: [],
        color: piece.color,
      });
      const expected: Square[] = [
        { file: "e", rank: "6" },
        { file: "c", rank: "6" },
        { file: "f", rank: "3" },
        { file: "f", rank: "5" },
        { file: "b", rank: "3" },
        { file: "b", rank: "5" },
        { file: "c", rank: "2" },
        { file: "e", rank: "2" },
      ];

      expect(moves).toEqual(expect.arrayContaining(expected));
    });
    it("should return all possible (8) moves when surrounded", () => {
      const piece: Piece = {
        file: "d",
        rank: "4",
        color: "white",
        points: 3,
        type: "Knight",
      };
      const blocking: Piece[] = [
        {
          file: "d",
          rank: "5",
          color: "white",
          points: 5,
          type: "Rook",
        },
        {
          file: "d",
          rank: "3",
          color: "white",
          points: 5,
          type: "Rook",
        },
        {
          file: "c",
          rank: "3",
          color: "white",
          points: 5,
          type: "Rook",
        },
        {
          file: "c",
          rank: "5",
          color: "white",
          points: 5,
          type: "Rook",
        },
        {
          file: "e",
          rank: "3",
          color: "white",
          points: 5,
          type: "Rook",
        },
        {
          file: "e",
          rank: "5",
          color: "white",
          points: 5,
          type: "Rook",
        },
        {
          file: "e",
          rank: "4",
          color: "white",
          points: 5,
          type: "Rook",
        },
        {
          file: "c",
          rank: "4",
          color: "white",
          points: 5,
          type: "Rook",
        },
      ];
      const moves = getLMoves({
        start: { file: piece.file, rank: piece.rank },
        pieces: blocking,
        color: piece.color,
      });
      const expected: Square[] = [
        { file: "e", rank: "6" },
        { file: "c", rank: "6" },
        { file: "f", rank: "3" },
        { file: "f", rank: "5" },
        { file: "b", rank: "3" },
        { file: "b", rank: "5" },
        { file: "c", rank: "2" },
        { file: "e", rank: "2" },
      ];

      expect(moves).toEqual(expect.arrayContaining(expected));
    });
    it("should return all possible (8) moves and capture opposing pieces", () => {
      const piece: Piece = {
        file: "d",
        rank: "4",
        color: "white",
        points: 3,
        type: "Knight",
      };
      const blocking: Piece[] = [
        {
          file: "f",
          rank: "6",
          color: "black",
          points: 5,
          type: "Rook",
        },
        {
          file: "c",
          rank: "2",
          color: "black",
          points: 5,
          type: "Rook",
        },
        {
          file: "c",
          rank: "6",
          color: "black",
          points: 5,
          type: "Rook",
        },
        {
          file: "f",
          rank: "2",
          color: "black",
          points: 5,
          type: "Rook",
        },
        {
          file: "b",
          rank: "3",
          color: "black",
          points: 5,
          type: "Rook",
        },
        {
          file: "b",
          rank: "5",
          color: "black",
          points: 5,
          type: "Rook",
        },
        {
          file: "e",
          rank: "2",
          color: "black",
          points: 5,
          type: "Rook",
        },
        {
          file: "e",
          rank: "6",
          color: "black",
          points: 5,
          type: "Rook",
        },
      ];

      const moves = getLMoves({
        start: { file: piece.file, rank: piece.rank },
        pieces: blocking,
        color: piece.color,
      });
      const expected: Square[] = [
        { file: "e", rank: "6" },
        { file: "c", rank: "6" },
        { file: "f", rank: "3" },
        { file: "f", rank: "5" },
        { file: "b", rank: "3" },
        { file: "b", rank: "5" },
        { file: "c", rank: "2" },
        { file: "e", rank: "2" },
      ];

      expect(moves).toEqual(expect.arrayContaining(expected));
    });
    it("should be blocked in all possible (8) moves by same color pieces", () => {
      const piece: Piece = {
        file: "d",
        rank: "4",
        color: "white",
        points: 3,
        type: "Knight",
      };

      const blocking: Piece[] = [
        {
          file: "f",
          rank: "6",
          color: "white",
          points: 5,
          type: "Rook",
        },
        {
          file: "c",
          rank: "2",
          color: "white",
          points: 5,
          type: "Rook",
        },
        {
          file: "c",
          rank: "6",
          color: "white",
          points: 5,
          type: "Rook",
        },
        {
          file: "f",
          rank: "2",
          color: "white",
          points: 5,
          type: "Rook",
        },
        {
          file: "b",
          rank: "3",
          color: "white",
          points: 5,
          type: "Rook",
        },
        {
          file: "b",
          rank: "5",
          color: "white",
          points: 5,
          type: "Rook",
        },
        {
          file: "e",
          rank: "2",
          color: "white",
          points: 5,
          type: "Rook",
        },
        {
          file: "e",
          rank: "6",
          color: "white",
          points: 5,
          type: "Rook",
        },
      ];

      const moves = getLMoves({
        start: { file: piece.file, rank: piece.rank },
        pieces: blocking,
        color: piece.color,
      });
      const expected: Square[] = [];
      console.log(moves);

      expect(moves).toEqual(expect.arrayContaining(expected));
    });
  });
  describe("Pawn", () => {
    it("should move 1 or 2 squares from start - white ", () => {
      const piece: Piece = {
        file: "c",
        rank: "2",
        color: "white",
        points: 1,
        type: "Pawn",
      };

      const moves = getPawnMoves({
        start: { file: piece.file, rank: piece.rank },
        pieces: [],
        color: piece.color,
      });

      const expected = [
        { file: "c", rank: "3" },
        { file: "c", rank: "4" },
      ];

      expect(moves).toEqual(expect.arrayContaining(expected));
    });
    it("should move 1 or 2 squares from start - black ", () => {
      const piece: Piece = {
        file: "c",
        rank: "7",
        color: "black",
        points: 1,
        type: "Pawn",
      };

      const moves = getPawnMoves({
        start: { file: piece.file, rank: piece.rank },
        pieces: [],
        color: piece.color,
      });

      const expected = [
        { file: "c", rank: "6" },
        { file: "c", rank: "5" },
      ];

      expect(moves).toEqual(expect.arrayContaining(expected));
    });
    it("should capture diagonally", () => {
      const piece: Piece = {
        file: "c",
        rank: "4",
        color: "white",
        points: 1,
        type: "Pawn",
      };

      const forCapturing: Piece[] = [
        { file: "b", rank: "5", type: "Bishop", color: "black", points: 3 },
        { file: "d", rank: "5", type: "Knight", color: "black", points: 3 },
        { file: "c", rank: "5", type: "Rook", color: "black", points: 1 },
      ];
      const moves = getPawnMoves({
        start: { file: piece.file, rank: piece.rank },
        pieces: forCapturing,
        color: piece.color,
      });

      const expected = [
        { file: "b", rank: "5" },
        { file: "d", rank: "5" },
      ];

      expect(moves).toEqual(expect.arrayContaining(expected));
    });
    it("should not capture same color", () => {
      const piece: Piece = {
        file: "c",
        rank: "4",
        color: "white",
        points: 1,
        type: "Pawn",
      };

      const forCapturing: Piece[] = [
        { file: "b", rank: "5", type: "Bishop", color: "white", points: 3 },
        { file: "d", rank: "5", type: "Knight", color: "black", points: 3 },
        { file: "c", rank: "6", type: "Rook", color: "white", points: 5 },
      ];
      const moves = getPawnMoves({
        start: { file: piece.file, rank: piece.rank },
        pieces: forCapturing,
        color: piece.color,
      });

      const expected = [{ file: "c", rank: "5" }];

      expect(moves).toEqual(expect.arrayContaining(expected));
    });

    it("should promote", () => {
      const piece: Piece = {
        file: "c",
        rank: "8",
        color: "white",
        points: 1,
        type: "Pawn",
      };
    });
  });
  describe("King", () => {
    it("should move on adjacent squares only", () => {
      const piece: Piece = {
        file: "e",
        rank: "4",
        color: "white",
        points: 1,
        type: "King",
      };
      const options: CalcMove = {
        start: { file: piece.file, rank: piece.rank },
        pieces: [],
        color: piece.color,
        adjacentOnly: true,
      };

      const moves = [
        ...getHorizontalAndVerticalMoves(options),
        ...getDiagonalMoves(options),
      ];

      const expected = [
        { file: "e", rank: "3" },
        { file: "e", rank: "5" },
        { file: "d", rank: "3" },
        { file: "d", rank: "4" },
        { file: "d", rank: "5" },
        { file: "f", rank: "3" },
        { file: "f", rank: "4" },
        { file: "f", rank: "5" },
      ];

      expect(moves).toEqual(expect.arrayContaining(expected));
    });
    it("should capture on adjacent squares only", () => {
      const piece: Piece = {
        file: "e",
        rank: "4",
        color: "white",
        points: 1,
        type: "King",
      };

      const forCapturing: Piece[] = [
        { file: "e", rank: "3", points: 1, color: "black", type: "Pawn" },
        { file: "e", rank: "5", points: 1, color: "black", type: "Pawn" },
        { file: "d", rank: "3", points: 1, color: "black", type: "Pawn" },
        { file: "d", rank: "4", points: 1, color: "black", type: "Pawn" },
        { file: "d", rank: "5", points: 1, color: "black", type: "Pawn" },
        { file: "f", rank: "3", points: 1, color: "black", type: "Pawn" },
      ];
      const options: CalcMove = {
        start: { file: piece.file, rank: piece.rank },
        pieces: forCapturing,
        color: piece.color,
        adjacentOnly: true,
      };

      const moves = [
        ...getHorizontalAndVerticalMoves(options),
        ...getDiagonalMoves(options),
      ];
      console.log(moves);
      const expected: Square[] = [
        { file: "e", rank: "3" },
        { file: "e", rank: "5" },
        { file: "d", rank: "3" },
        { file: "d", rank: "4" },
        { file: "d", rank: "5" },
        { file: "f", rank: "3" },
        { file: "f", rank: "4" },
        { file: "f", rank: "5" },
      ];

      expect(moves).toEqual(expect.arrayContaining(expected));
    });
    it("should not capture same color pieces", () => {
      const piece: Piece = {
        file: "e",
        rank: "4",
        color: "white",
        points: 1,
        type: "King",
      };

      const forCapturing: Piece[] = [
        { file: "e", rank: "3", points: 1, color: "white", type: "Pawn" },
        { file: "e", rank: "5", points: 1, color: "white", type: "Pawn" },
        { file: "d", rank: "3", points: 1, color: "white", type: "Pawn" },
        { file: "d", rank: "4", points: 1, color: "white", type: "Pawn" },
        { file: "d", rank: "5", points: 1, color: "white", type: "Pawn" },
        { file: "f", rank: "3", points: 1, color: "white", type: "Pawn" },
        { file: "f", rank: "4", points: 1, color: "white", type: "Pawn" },
        { file: "f", rank: "5", points: 1, color: "white", type: "Pawn" },
      ];
      const options: CalcMove = {
        start: { file: piece.file, rank: piece.rank },
        pieces: forCapturing,
        color: piece.color,
        adjacentOnly: true,
      };

      const moves = [
        ...getHorizontalAndVerticalMoves(options),
        ...getDiagonalMoves(options),
      ];

      const expected: [] = [];

      expect(moves).toEqual(expected);
    });
  });
  describe("Castle", () => {
    //globals
    const king: Piece = {
      file: "e",
      rank: "1",
      color: "white",
      points: 1,
      type: "King",
    };
    const kingBlack: Piece = {
      file: "e",
      rank: "8",
      color: "black",
      points: 1,
      type: "King",
    };
    const rookA: Piece = {
      file: "a",
      rank: "1",
      color: "white",
      points: 5,
      type: "Rook",
    };
    const rookH: Piece = {
      file: "h",
      rank: "1",
      color: "white",
      points: 5,
      type: "Rook",
    };

    const [shortW, longW]: Square[] = [
      { file: "g", rank: "1" },
      { file: "c", rank: "1" },
    ];
    const [shortB, longB]: Square[] = [
      { file: "g", rank: "8" },
      { file: "c", rank: "8" },
    ];

    describe("No moves", () => {
      it("should be able to castle both ways", () => {
        const pieces: Piece[] = [king, rookA, rookH];

        const game: Game = {
          id: "id",
          moves: [],
          pieces,
          playerBlackId: "1",
          playerWhiteId: "2",
        };

        const castle = getCastleSquares(game, king);

        expect(castle).toMatchObject([longW, shortW]);
      });
      it("should be able to castle long only - 1 rook present", () => {
        const pieces: Piece[] = [king, rookA];

        const game: Game = {
          id: "id",
          moves: [],
          pieces,
          playerBlackId: "1",
          playerWhiteId: "2",
        };

        const castle = getCastleSquares(game, king);

        expect(castle).toMatchObject([longW]);
      });
      it("should be able to castle short only - 1 rook present", () => {
        const pieces: Piece[] = [king, rookH];

        const game: Game = {
          id: "id",
          moves: [],
          pieces,
          playerBlackId: "1",
          playerWhiteId: "2",
        };

        const castle = getCastleSquares(game, king);

        expect(castle).toMatchObject([shortW]);
      });
    });
    describe("Rook has moved and returned", () => {
      it("should castle short only", () => {
        const pieces: Piece[] = [king, rookA, rookH];

        const moves: Move[] = [
          {
            gameId: "id",
            id: "2",
            piece: JSON.stringify(rookA),
            targetFile: "a",
            targetRank: "1",
          },
          {
            gameId: "id",
            id: "1",
            piece: JSON.stringify(rookA),
            targetFile: "a",
            targetRank: "2",
          },
        ];

        const game: Game = {
          id: "id",
          moves,
          pieces,
          playerBlackId: "1",
          playerWhiteId: "2",
        };

        const castle = getCastleSquares(game, king);

        expect(castle).toMatchObject([shortW]);
      });
      it("should castle long only", () => {
        const pieces: Piece[] = [king, rookA, rookH];

        const moves: Move[] = [
          {
            gameId: "id",
            id: "2",
            piece: JSON.stringify(rookH),
            targetFile: "h",
            targetRank: "1",
          },
          {
            gameId: "id",
            id: "1",
            piece: JSON.stringify(rookH),
            targetFile: "h",
            targetRank: "2",
          },
        ];

        const game: Game = {
          id: "id",
          moves,
          pieces,
          playerBlackId: "1",
          playerWhiteId: "2",
        };

        const castle = getCastleSquares(game, king);

        expect(castle).toMatchObject([longW]);
      });
      it("should not castle", () => {
        const pieces: Piece[] = [king, rookA, rookH];

        const moves: Move[] = [
          {
            gameId: "id",
            id: "1",
            piece: JSON.stringify(rookH),
            targetFile: "h",
            targetRank: "2",
          },
          {
            gameId: "id",
            id: "2",
            piece: JSON.stringify(rookH),
            targetFile: "h",
            targetRank: "1",
          },
          {
            gameId: "id",
            id: "1",
            piece: JSON.stringify(rookA),
            targetFile: "a",
            targetRank: "2",
          },
          {
            gameId: "id",
            id: "2",
            piece: JSON.stringify(rookA),
            targetFile: "a",
            targetRank: "1",
          },
        ];

        const game: Game = {
          id: "id",
          moves,
          pieces,
          playerBlackId: "1",
          playerWhiteId: "2",
        };

        const castle = getCastleSquares(game, king);

        expect(castle).toMatchObject([]);
      });
    });
    describe("Rooks have moved and haven't returned", () => {
      //locals
      const king: Piece = {
        file: "e",
        rank: "1",
        color: "white",
        points: 1,
        type: "King",
      };
      const rookA: Piece = {
        file: "a",
        rank: "2",
        color: "white",
        points: 5,
        type: "Rook",
      };
      const rookH: Piece = {
        file: "h",
        rank: "2",
        color: "white",
        points: 5,
        type: "Rook",
      };
      it("should not castle", () => {
        const pieces: Piece[] = [king, rookA, rookH];

        const game: Game = {
          id: "id",
          moves: [],
          pieces,
          playerBlackId: "1",
          playerWhiteId: "2",
        };

        const castle = getCastleSquares(game, king);

        expect(castle).toMatchObject([]);
      });
    });
    describe("King moved", () => {
      it("should not castle", () => {
        const pieces: Piece[] = [king, rookA, rookH];
        const moves: Move[] = [
          {
            gameId: "id",
            id: "2",
            piece: JSON.stringify(king),
            targetFile: "e",
            targetRank: "2",
          },
          {
            gameId: "id",
            id: "3",
            piece: JSON.stringify(king),
            targetFile: "e",
            targetRank: "1",
          },
        ];

        const game: Game = {
          id: "id",
          moves,
          pieces,
          playerBlackId: "1",
          playerWhiteId: "2",
        };

        const castle = getCastleSquares(game, king);

        expect(castle).toMatchObject([]);
      });
    });
    describe("Blocking piece", () => {
      const blackKnight = new Knight({ file: "g", rank: "1" }, "black");
      const whiteKnight = new Knight({ file: "b", rank: "1" }, "white");

      it("should not castle - blocking opponent piece", () => {
        const pieces: Piece[] = [king, rookA, rookH, blackKnight];

        const game: Game = {
          id: "id",
          moves: [],
          pieces,
          playerBlackId: "1",
          playerWhiteId: "2",
        };
        const castle = getCastleSquares(game, king);

        expect(castle).toMatchObject([{ file: "c", rank: "1" }]);
      });
      it("should not castle - own blocking piece", () => {
        const pieces: Piece[] = [king, rookA, rookH, whiteKnight];

        const game: Game = {
          id: "id",
          moves: [],
          pieces,
          playerBlackId: "1",
          playerWhiteId: "2",
        };
        const castle = getCastleSquares(game, king);

        expect(castle).toMatchObject([{ file: "g", rank: "1" }]);
      });
      it("should not castle - both sides blocked", () => {
        const pieces: Piece[] = [king, rookA, rookH, whiteKnight, blackKnight];

        const game: Game = {
          id: "id",
          moves: [],
          pieces,
          playerBlackId: "1",
          playerWhiteId: "2",
        };
        const castle = getCastleSquares(game, king);

        expect(castle).toMatchObject([]);
      });
    });
    describe("Targeted square", () => {
      it("should not castle short - 2", () => {
        const blackRook = new Rook({ file: "g", rank: "8" }, "black");
        const pieces: Piece[] = [king, rookA, rookH, blackRook];

        const game: Game = {
          id: "id",
          moves: [],
          pieces,
          playerBlackId: "1",
          playerWhiteId: "2",
        };

        const castle = getCastleSquares(game, king);

        expect(castle).toMatchObject([longW]);
      });
      it("should not castle long", () => {
        const blackRook = new Rook({ file: "c", rank: "8" }, "black");
        const pieces: Piece[] = [king, rookA, rookH, blackRook];

        const game: Game = {
          id: "id",
          moves: [],
          pieces,
          playerBlackId: "1",
          playerWhiteId: "2",
        };

        const castle = getCastleSquares(game, king);

        expect(castle).toMatchObject([shortW]);
      });
      it("should not castle short - 2", () => {
        const blackRook = new Rook({ file: "f", rank: "8" }, "black");
        const pieces: Piece[] = [king, rookA, rookH, blackRook];

        const game: Game = {
          id: "id",
          moves: [],
          pieces,
          playerBlackId: "1",
          playerWhiteId: "2",
        };

        const castle = getCastleSquares(game, king);

        expect(castle).toMatchObject([longW]);
      });
      it("should not castle long", () => {
        const blackRook = new Rook({ file: "d", rank: "8" }, "black");
        const pieces: Piece[] = [king, rookA, rookH, blackRook];

        const game: Game = {
          id: "id",
          moves: [],
          pieces,
          playerBlackId: "1",
          playerWhiteId: "2",
        };

        const castle = getCastleSquares(game, king);

        expect(castle).toMatchObject([shortW]);
      });
      it("should not castle - check", () => {
        const blackRook = new Rook({ file: "e", rank: "8" }, "black");
        const pieces: Piece[] = [king, rookA, rookH, blackRook];

        const game: Game = {
          id: "id",
          moves: [],
          pieces,
          playerBlackId: "1",
          playerWhiteId: "2",
        };

        const castle = getCastleSquares(game, king);

        expect(castle).toMatchObject([]);
      });
      it("should not castle - multiple fields targeted by 1 piece", () => {
        const blackBishop = new Rook({ file: "e", rank: "2" }, "black");

        const pieces: Piece[] = [king, rookA, rookH, blackBishop];

        const game: Game = {
          id: "id",
          moves: [],
          pieces,
          playerBlackId: "1",
          playerWhiteId: "2",
        };

        const castle = getCastleSquares(game, king);

        expect(castle).toMatchObject([]);
      });
      it("should castle", () => {
        const blackRook1 = new Rook({ file: "b", rank: "8" }, "black");
        const blackRook2 = new Rook({ file: "a", rank: "8" }, "black");
        const blackRook3 = new Rook({ file: "h", rank: "8" }, "black");
        const pieces: Piece[] = [
          king,
          rookA,
          rookH,
          blackRook1,
          blackRook2,
          blackRook3,
        ];

        const game: Game = {
          id: "id",
          moves: [],
          pieces,
          playerBlackId: "1",
          playerWhiteId: "2",
        };

        const castle = getCastleSquares(game, king);

        expect(castle).toMatchObject([longW, shortW]);
      });
    });

    it("should castle - pawn blocking target square", () => {
      const whitePawn = new Pawn({ file: "g", rank: "3" }, "white");
      const blackRook = new Rook({ file: "g", rank: "8" }, "black");
      const pieces: Piece[] = [king, rookA, rookH, blackRook, whitePawn];

      const game: Game = {
        id: "id",
        moves: [],
        pieces,
        playerBlackId: "1",
        playerWhiteId: "2",
      };

      const castle = getCastleSquares(game, king);

      expect(castle).toMatchObject([longW, shortW]);
    });

    it("should not castle - starting position Black/White", () => {
      const { pieces } = initBoard();
      const game: Game = {
        id: "id",
        moves: [],
        pieces,
        playerBlackId: "1",
        playerWhiteId: "2",
      };
      const castleW = getCastleSquares(game, king);
      const castleB = getCastleSquares(game, kingBlack);

      expect(castleW).toMatchObject([]);
      expect(castleB).toMatchObject([]);
    });
    it("should castle both ways - no queen, knight, bishop", () => {
      const { pieces } = initBoard();

      const game: Game = {
        id: "id",
        moves: [],
        pieces: pieces.filter(
          (p) =>
            p.type !== "Bishop" && p.type !== "Queen" && p.type !== "Knight"
        ),
        playerBlackId: "1",
        playerWhiteId: "2",
      };
      const castleW = getCastleSquares(game, king);
      const castleB = getCastleSquares(game, kingBlack);

      expect(castleW).toMatchObject([longW, shortW]);
      expect(castleB).toMatchObject([longB, shortB]);
    });
  });
});
