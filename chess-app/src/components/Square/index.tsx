import { FunctionComponent, useState } from "react";
import classNames from "classnames";
import "./index.css";
import { Color, Piece, SquareContext } from "../../types";
import { letters, numbers } from "../../utils/squares";

type SquareProps = SquareContext & {
  onClick: (squareContext: SquareContext) => void;
};

const Square: FunctionComponent<SquareProps> = ({
  rank,
  file,
  piece,
  onClick,
}) => {
  const [focused, setFocused] = useState<Boolean>(false);
  const handleClick = (squareContext: SquareContext) => {
    onClick(squareContext);
    if (squareContext.piece) {
      setFocused(true);
    }
  };
  const color: Color =
    (letters.indexOf(file) + numbers.indexOf(rank)) % 2 === 1
      ? "white"
      : "black";
  return (
    <div
      className={classNames(color, "square")}
      onClick={() => handleClick({ rank, file, piece })}
    >
      {piece ? piece.type + " " + piece.color : <></>}
    </div>
  );
};

export default Square;
