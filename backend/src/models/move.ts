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
import { Rank, File, MoveType } from "@chessboard/types";

@Table({ tableName: "Move", createdAt: false, updatedAt: false })
export class Move extends Model {
  @PrimaryKey
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @BelongsTo(() => Game, {
    foreignKey: "gameId",
  })
  declare game: Game;

  @Column(DataType.STRING)
  declare targetRank: Rank;

  @Column(DataType.STRING)
  declare targetFile: File;

  @AllowNull(true)
  @Column(DataType.STRING)
  declare moveType: MoveType;

  @Column(DataType.JSON)
  declare piece: string;

  @ForeignKey(() => Game)
  @Column(DataType.UUID)
  declare gameId: string;
}
