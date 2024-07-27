import {
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
import { Rank, File } from "@chessboard/types";

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
  game: Game;

  @Column(DataType.STRING)
  targetRank: Rank;

  @Column(DataType.STRING)
  targetFile: File;

  @Column(DataType.JSON)
  piece: string;

  @ForeignKey(() => Game)
  @Column(DataType.UUID)
  gameId: string;
}
