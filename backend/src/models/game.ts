import {
  AllowNull,
  Column,
  DataType,
  Default,
  HasMany,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

import { Move } from "./move";

@Table({ tableName: "Game" })
export class Game extends Model {
  @PrimaryKey
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  // change both to false when user is implemented
  @AllowNull(true)
  @Column(DataType.STRING)
  playerWhiteId?: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  playerBlackId?: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  result?: string;

  @HasMany(() => Move, { foreignKey: "gameId" })
  moves: Move[];
}
