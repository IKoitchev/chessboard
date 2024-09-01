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
        .get<Game>(`${baseURL}/chessboard/start`, {
          headers: { authorization: `Bearer ${getAccessToken()}` },
        })
        .then((res) => {
          console.log(res.data);
          setGame(game);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    console.log(isLoggedIn ? "logged" : "not logged");
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
  }, [isLoggedIn]);

  return (
    <>
      {gameId ? null : (
        <>
          <button
            className="mr-1 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            onClick={handleReverse}
          >
            Switch POV
          </button>
          <button
            className="ml-1 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            onClick={handleStart}
          >
            Start a game
          </button>
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
      <div className="w-1/2 inline-flex "></div>
    </>
  );
}
