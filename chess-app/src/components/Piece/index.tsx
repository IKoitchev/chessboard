import { FunctionComponent } from "react";
import { Piece } from "../../types";
import { useDraggable } from "@dnd-kit/core";

import "./index.css";

interface PieceIconProps {
  piece: Piece | undefined;
}
const PieceIcon: FunctionComponent<PieceIconProps> = ({ piece }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: piece ? piece.file + piece.rank : "no-id",
      data: piece,
    });

  if (!piece) {
    return null;
  }
  return (
    <img
      className="piece draggable"
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      src={`/pieces/${piece.color}-${piece.type}.png`}
      style={{
        transform: `translate(${transform?.x ?? 0}px, ${transform?.y ?? 0}px)`,
        // zIndex: isDragging ? 2 : 1,
      }}
    />
  );
};

export default PieceIcon;
