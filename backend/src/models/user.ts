import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { Game } from "./game";

@Table({ tableName: "User", createdAt: true, updatedAt: true })
export class User extends Model {
  @PrimaryKey
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column(DataType.STRING)
  declare primaryEmail: string;

  @Column(DataType.STRING)
  declare username: string;

  @Column(DataType.STRING)
  declare password: string;

  @ForeignKey(() => Game)
  @AllowNull(true)
  @Column(DataType.UUID)
  declare currentGameId: string;

  // Association with the Game model
  @BelongsTo(() => Game, { as: "currentGame" })
  declare currentGame: Game;
}
