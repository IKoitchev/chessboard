import { useEffect, useState } from "react";
import ChessBoard from "../Chessboard";
import "./index.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../../utils/axiosClient";
import { type Game } from "../../types";
import { useUser } from "../UserProvider";
import { useWebSocket } from "../WsProvdier";

export default function PlayPage() {
  const [isBlackPOV, setBlackPOV] = useState<boolean>(false);
  const [game, setGame] = useState<Game>();
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [isBlackTurn, setBlackTurn] = useState<boolean>(false);
  const { getAccessToken } = useUser();
  const { isConnected, messages, sendMessage } = useWebSocket();

  const handleReverse = () => {
    setBlackPOV((old) => !old);
  };

  const handleChangeTurn = () => {
    setBlackTurn((old) => !old);
  };

  const handleStart = async () => {
    const { data: newGame } = await axios.post<Game>(
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
        .get<Game>(`${baseURL}/chessboard/play/${gameId}`)
        .then((res) => {
          console.log("get game", res.data);
          setGame(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  useEffect(() => {
    if (gameId) {
      axios
        .get<Game>(`${baseURL}/chessboard/play/${gameId}`)
        .then((res) => {
          setGame(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [gameId]);
  return (
    <>
      {/* <button
        onClick={() => {
          axios
            .get(`${baseURL}/chessboard/protected`, {
              headers: { authorization: `Bearer ${getAccessToken()}` },
            })
            .then((res) => console.log(res))
            .catch((err) => console.log(err.message));
        }}
      >
        Test connection
      </button> */}
      <button onClick={() => console.log(isConnected)}>WS</button>
      <button onClick={() => sendMessage("msg")}>send message</button>
      <button onClick={() => console.log(isConnected)}>WS</button>
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
              isPractice={!gameId}
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
