import { FunctionComponent, useEffect, useState } from "react";
import "./index.css";
import { request } from "../../utils/axiosClient";
import {
  BoardContext,
  Column,
  Piece,
  Row,
  Square,
  SquareContext,
} from "../../types";
import SquareComponent from "../Square";
import { areSameSquare, capture, findPieceBySquare } from "../../utils/moves";

interface ChessBoardProps {
  reverse: boolean;
}

const ChessBoard: FunctionComponent<ChessBoardProps> = ({ reverse }) => {
  let letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
  let numbers = ["1", "2", "3", "4", "5", "6", "7", "8"];

  const [pieces, setPieces] = useState<Piece[]>([]);

  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);

  useEffect(() => {
    request<BoardContext>({ url: "/chessboard/start", method: "GET" })
      .then((res) => {
        console.log(res.data);
        setPieces(res.data.activePieces);
        //setcaptured?
      })
      .catch((err) => {
        console.log(err);
      });

    if (reverse) {
      letters = letters.reverse();
      numbers = numbers.reverse();
    }
  }, []);

  // TO-DO reduce complexity, this is repeated 64 times on each render

  const handleClick = (squareContext: SquareContext) => {
    // console.log(squareContext);
    console.log(pieces.length);

    if (squareContext.piece && !selectedPiece) {
      setSelectedPiece(squareContext.piece);
      return;
    }

    if (selectedPiece) {
      const updatedPieces = [...pieces];
      const targetSquare = squareContext as Square;

      const targetPiece = pieces.find((p) =>
        areSameSquare(p.position, targetSquare)
      );
      console.log("targetPiece", targetPiece);
      console.log("selectedPiece", selectedPiece);

      // set the selectedpiece position to be the same as the target
      const selectedIndex = pieces.indexOf(selectedPiece);
      updatedPieces[selectedIndex].position = targetSquare;

      if (targetPiece) {
        const targetIndex = pieces.indexOf(targetPiece);
        updatedPieces[targetIndex].position = null;
      }
      setPieces(updatedPieces);
      console.log("unselecting");
      setSelectedPiece(null);
    }
  };

  return (
    <div className="chessboard">
      {numbers.reverse().map((number) => {
        return (
          <>
            <div className="label rank">{number}</div>
            {letters.map((letter) => {
              const color =
                (numbers.indexOf(number) + letters.indexOf(letter)) % 2 === 0
                  ? "white"
                  : "black";

              return (
                <>
                  <SquareComponent
                    key={letter + number}
                    file={letter as Column}
                    rank={number as Row}
                    color={color}
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
      {letters.map((letter) => {
        return <div className="label file">{letter.toLocaleUpperCase()}</div>;
      })}
    </div>
  );
};

export default ChessBoard;
