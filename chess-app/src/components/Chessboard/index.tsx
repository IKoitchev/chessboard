import { FunctionComponent, useEffect, useState } from "react";
import "./index.css";
import { request } from "../../utils/axiosClient";
import { BoardContext, Column, Piece, Row, SquareContext } from "../../types";
import SquareComponent from "../Square";
import { findPieceBySquare } from "../../utils/moves";
import { letters as files, numbers as ranks } from "../../utils/squares";

interface ChessBoardProps {
  reverse: boolean;
}

const ChessBoard: FunctionComponent<ChessBoardProps> = ({ reverse }) => {
  let letters = [...files];
  let numbers = [...ranks].reverse();

  const [pieces, setPieces] = useState<Piece[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    request<BoardContext>({ url: "/chessboard/start", method: "GET" })
      .then((res) => {
        setPieces(res.data.pieces);
      })
      .catch((err) => {
        console.log(err);
        setError(error);
      });
  }, []);

  // TO-DO reduce complexity, this is repeated 64 times on each render
  const handleClick = async (squareContext: SquareContext) => {
    if (squareContext.piece && !selectedPiece) {
      setSelectedPiece(squareContext.piece);
      return;
    }

    if (selectedPiece) {
      const { data } = await request<Piece[]>({
        url: "/chessboard/move",
        method: "POST",
        data: {
          piece: selectedPiece,
          target: { file: squareContext.file, rank: squareContext.rank },
          state: { pieces: pieces },
        },
      });
      // console.log(data);
      setPieces(data);

      // console.log("unselecting");
      setSelectedPiece(null);
    }
  };

  return (
    <div className="chessboard">
      {(reverse ? [...numbers].reverse() : numbers).map((number) => {
        return (
          <>
            <div className="label rank">{number}</div>
            {(reverse ? [...letters].reverse() : letters).map((letter) => {
              return (
                <>
                  <SquareComponent
                    key={letter + number}
                    file={letter as Column}
                    rank={number as Row}
                    piece={findPieceBySquare(pieces, letter, number)}
                    onClick={handleClick}
                  />
                </>
              );
            })}
          </>
        );
      })}

      <div className="corner"></div>
      {(reverse ? [...letters].reverse() : letters).map((letter) => {
        return <div className="label file">{letter.toLocaleUpperCase()}</div>;
      })}
    </div>
  );
};

export default ChessBoard;
