import { useCallback, useState } from "react";
import ChessBoard from "../Chessboard";
import "./index.css";

export default function PlayPage() {
  const [isBlackPOV, setBlackPOV] = useState<boolean>(false);

  const handleReverse = () => {
    setBlackPOV((old) => !old);
  };

  return (
    <>
      <button onClick={handleReverse}>Reverse</button>
      <div className="container">
        <ChessBoard reverse={isBlackPOV} />
      </div>
      <div className="container">container 2</div>
    </>
  );
}
