import ChessBoard from "../Chessboard";
import "./index.css";

export default function PlayPage() {
  return (
    <>
      <div className="container">
        <ChessBoard reverse={false} />
      </div>
      <div className="container">container 2</div>
    </>
  );
}
