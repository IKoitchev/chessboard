import { Sequelize } from "sequelize-typescript";
import * as path from "path";
import { Game } from "../models/game";
import { Move } from "../models/move";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: `${path.join(
    path.resolve(),
    "src",
    "utils",
    "db",
    "chessdb.sqlite"
  )}`,
  logging: false,
  models: [Game, Move],
});

export default sequelize;
