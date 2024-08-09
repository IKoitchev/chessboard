import { Sequelize } from "sequelize-typescript";
import * as path from "path";
import { Game, Move, User } from "../models/index";

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
  models: [Game, Move, User],
});

export default sequelize;
