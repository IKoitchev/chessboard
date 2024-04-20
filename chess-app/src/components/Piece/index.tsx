import { FunctionComponent } from "react";
import { Piece } from "../../types";
import { useDraggable } from "@dnd-kit/core";
interface PieceIconProps {
  piece: Piece | undefined;
}
const PieceIcon: FunctionComponent<PieceIconProps> = ({ piece }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: piece ? piece.file + piece.rank : "no-id",
    data: piece,
  });

  if (!piece) {
    return null;
  }
  return (
    // <div
    //   className="img-container"
    //   ref={setNodeRef}
    //   {...listeners}
    //   {...attributes}
    // >
    // </div>
    <img
      className="piece"
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      src={`/pieces/${piece.color}-${piece.type}.png`}
    />
  );
};

export default PieceIcon;
