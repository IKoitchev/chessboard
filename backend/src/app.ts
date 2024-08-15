import Koa from "koa";
import * as HttpStatus from "http-status-codes";
import cors from "@koa/cors";
import bodyParser from "koa-bodyparser";
import logger from "koa-logger";
import sequelize from "./utils/sqlite";
import authRoutes from "./routes/auth.routes";
import chessRoutes from "./routes/chess.routes";
import websockify from "koa-websocket";
import moveRoutes from "./routes/move.routes";
import { ErrorHandling } from "./middleware/errorHandling.middleware";
// const app: Koa = new Koa();

const app = websockify(new Koa());

// Generic error handling middleware.

// sequelize.sync();
sequelize.sync({ alter: true });

app.use(cors());
app.use(logger());
app.use(bodyParser());

app.use(ErrorHandling);
app.use(chessRoutes.routes());
app.use(chessRoutes.allowedMethods());

app.use(authRoutes.routes());
app.use(authRoutes.allowedMethods());

app.ws.use(moveRoutes);

// Application error logging.
// app.on("error", console.error);

export default app;
