import { type FunctionComponent, useCallback, useState } from "react";
import classNames from "classnames";
import "./index.css";
import {
  Piece,
  Promotable,
  Square as SquareType,
  type Color,
  type SquareContext,
} from "../../types";
import { letters, numbers } from "../../utils/squares";
import PieceIcon from "../Piece";
import { useDroppable } from "@dnd-kit/core";

type SquareStyle = "default" | "selected" | "moved";

type SquareProps = SquareContext & {
  onClick: (squareContext: SquareContext) => void;
  onSelectProm: (promoteTo: Promotable) => void;
  isPromoting: boolean;
};

const Square: FunctionComponent<SquareProps> = ({
  rank,
  file,
  piece,
  isPromoting,
  onClick,
  onSelectProm,
}) => {
  // const [focused, setFocused] = useState<boolean>(false);
  const [style, setStyle] = useState<SquareStyle>("default");

  const { setNodeRef } = useDroppable({
    id: file + rank,
    data: { piece, rank, file },
  });

  const handleClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    squareContext: SquareContext
  ) => {
    if (
      e.target instanceof HTMLOptionElement ||
      e.target instanceof HTMLSelectElement
    ) {
      return;
    }

    onClick(squareContext);

    if (squareContext.piece) {
      // setFocused((old) => !old);
      setStyle("selected");
    }
  };

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
    onSelectProm(e.target.value as Promotable);
  };

  const isOnPromSquare = useCallback(() => {
    if (!piece) {
      return false;
    }
    if (
      piece.color === "black" &&
      piece.rank === "1" &&
      piece.type === "Pawn"
    ) {
      return true;
    }

    if (
      piece.color === "white" &&
      piece.rank === "8" &&
      piece.type === "Pawn"
    ) {
      return true;
    }

    return false;
  }, [piece, rank]);

  const color: Color =
    (letters.indexOf(file) + numbers.indexOf(rank)) % 2 === 1
      ? "white"
      : "black";
  return (
    <div
      className={classNames(color, "square", style)}
      onClick={(e) => {
        handleClick(e, { rank, file, piece });
      }}
      ref={setNodeRef}
    >
      {isPromoting ? (
        <select onChange={handleSelect} name="prom-select" id="prom-select">
          <option>Rook</option>
          <option>Bishop</option>
          <option>Knight</option>
          <option>Queen</option>
        </select>
      ) : null}
      <PieceIcon piece={piece} />
    </div>
  );
};

export default Square;
