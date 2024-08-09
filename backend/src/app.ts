import Koa from "koa";
import * as HttpStatus from "http-status-codes";
import cors from "@koa/cors";
import bodyParser from "koa-bodyparser";
import logger from "koa-logger";
import sequelize from "./utils/sqlite";
import authRoutes from "./routes/auth.routes";
import chessRoutes from "./routes/chess.routes";

const app: Koa = new Koa();

// Generic error handling middleware.
app.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
  try {
    await next();
  } catch (error) {
    ctx.status =
      error.statusCode ||
      error.status ||
      HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR;
    error.status = ctx.status;
    ctx.body = { error };
    ctx.app.emit("error", error, ctx);
  }
});

sequelize.sync();

// sequelize.sync({ alter: true });

app.use(cors());
app.use(logger());
app.use(bodyParser());
app.use(chessRoutes.routes());
app.use(chessRoutes.allowedMethods());

app.use(authRoutes.routes());
app.use(authRoutes.allowedMethods());

// Application error logging.
// app.on("error", console.error);

export default app;
