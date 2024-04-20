import { FunctionComponent, useState } from "react";
import classNames from "classnames";
import "./index.css";
import { Color, SquareContext } from "../../types";
import { letters, numbers } from "../../utils/squares";
import PieceIcon from "../Piece";
import { useDroppable } from "@dnd-kit/core";

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

  const { isOver, setNodeRef } = useDroppable({
    id: file + rank,
    data: { piece, rank, file },
  });
  const handleClick = (squareContext: SquareContext) => {
    onClick(squareContext);
    if (squareContext.piece) {
      setFocused((old) => !old);
    }
  };
  const color: Color =
    (letters.indexOf(file) + numbers.indexOf(rank)) % 2 === 1
      ? "white"
      : "black";
  return (
    <div
      className={classNames(color, "square", focused ? "focused" : "")}
      onClick={() => handleClick({ rank, file, piece })}
      ref={setNodeRef}
    >
      <PieceIcon piece={piece} />
    </div>
  );
};

export default Square;
