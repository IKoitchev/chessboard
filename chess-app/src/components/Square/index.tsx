import { FunctionComponent, useState } from "react";
import classNames from "classnames";
import "./index.css";
import { Piece, SquareContext } from "../../types";

type SquareProps = SquareContext & {
  onClick: (squareContext: SquareContext) => void;
};

const Square: FunctionComponent<SquareProps> = ({
  rank,
  file,
  color,
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
  return (
    <div
      className={classNames(color, "square")}
      onClick={() => handleClick({ rank, file, color, piece })}
    >
      {piece ? piece.type : <></>}
    </div>
  );
};

export default Square;
