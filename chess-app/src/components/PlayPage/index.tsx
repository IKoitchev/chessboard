import { useCallback, useEffect, useState } from "react";
import ChessBoard from "../Chessboard";
import "./index.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { baseURL, request } from "../../utils/axiosClient";
import { GameContext } from "../../types";

export default function PlayPage() {
  const [isBlackPOV, setBlackPOV] = useState<boolean>(false);
  const [game, setGame] = useState<GameContext>();
  const { gameId } = useParams();
  const navigate = useNavigate();

  const handleReverse = () => {
    setBlackPOV((old) => !old);
  };

  const handleStart = async () => {
    const { data: newGame } = await axios.post<GameContext>(
      `${baseURL}/chessboard/play`
    );
    console.log(newGame);
    console.log("naving", `/play/${newGame.id}`);
    navigate(`/play/${newGame.id}`);
  };

  useEffect(() => {
    console.log(gameId);
    if (gameId) {
      axios
        .get<GameContext>(`${baseURL}/chessboard/play/${gameId}`)
        .then((res) => {
          console.log("get game", res.data);
          setGame(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  useEffect(() => {
    // console.log("gmaid", gameId);

    if (gameId) {
      axios
        .get<GameContext>(`${baseURL}/chessboard/play/${gameId}`)
        .then((res) => {
          setGame(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [gameId]);
  return (
    <>
      {gameId ? (
        <></>
      ) : (
        <>
          <button onClick={handleReverse}>Reverse</button>
          <button onClick={handleStart}>Start a game</button>
        </>
      )}

      <div className="container">
        {game ? (
          <>
            <ChessBoard reverse={isBlackPOV} isPractice={!gameId} game={game} />
          </>
        ) : (
          <></>
        )}
      </div>
      <div className="container">container 2</div>
    </>
  );
}
