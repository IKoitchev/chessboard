import { useEffect, useState } from "react";
import ChessBoard from "../Chessboard";
import "./index.css";
import { useNavigate, useParams } from "react-router-dom";
import axios, { AxiosRequestConfig } from "axios";
import { baseURL } from "../../utils/axiosClient";
import { MoveRequest, type Game } from "../../types";
import { useUser } from "../UserProvider";
import { useWebSocket } from "../WsProvdier";

export default function PlayPage() {
  const [isBlackPOV, setBlackPOV] = useState<boolean>(false);
  const [game, setGame] = useState<Game>();
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [isBlackTurn, setBlackTurn] = useState<boolean>(false);
  const { getAccessToken, isLoggedIn } = useUser();
  const { isConnected, messages, sendMessage } = useWebSocket();

  const handleReverse = () => {
    setBlackPOV((old) => !old);
  };

  const handleChangeTurn = () => {
    setBlackTurn((old) => !old);
  };

  const handleStart = async () => {
    if (isLoggedIn) {
      axios
        .get<Game>(`${baseURL}/chessboard/play`, {
          headers: { authorization: `Bearer ${getAccessToken()}` },
        })
        .then((res) => {
          console.log(res.data);
          console.log("naving", `/play/${res.data.id}`);
          navigate(`/play/${res.data.id}`);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      axios
        .get<Game>(`${baseURL}/chessboard/play`, {
          headers: { authorization: `Bearer ${getAccessToken()}` },
        })
        .then((res) => {
          setGame(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axios
        .get<Game>(`${baseURL}/chessboard/practice`)
        .then((res) => {
          setGame((old) => {
            console.log(res.data);
            const updated: Game = { ...res.data, moves: old?.moves || [] };
            return updated;
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  return (
    <>
      {gameId ? null : (
        <>
          <button onClick={handleReverse}>Reverse</button>
          <button onClick={handleStart}>Start a game</button>
        </>
      )}
      <div className="w-max">
        {isBlackTurn ? "Black's turn" : "White's turn"}
      </div>
      <div className="w-1/2 inline-flex ">
        {game ? (
          <>
            <ChessBoard
              reverse={isBlackPOV}
              isPractice={!Boolean(gameId)}
              game={game}
              changeTurn={setBlackTurn}
            />
          </>
        ) : null}
      </div>
      <div className="w-1/2 inline-flex ">container 2</div>
    </>
  );
}
