import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

import { Move } from "./move";
import { User } from "./user";

@Table({ tableName: "Game" })
export class Game extends Model {
  @PrimaryKey
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare playerWhiteId: string;

  // Association with the User model as playerWhite
  @BelongsTo(() => User, { as: "playerWhite", foreignKey: "playerWhiteId" })
  declare playerWhite: User;

  // Foreign key to the User table for playerBlack
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare playerBlackId: string;

  // Association with the User model as playerBlack
  @BelongsTo(() => User, { as: "playerBlack", foreignKey: "playerBlackId" })
  declare playerBlack: User;

  @AllowNull(true)
  @Column(DataType.STRING)
  declare result?: string;

  @HasMany(() => Move, { foreignKey: "gameId" })
  declare moves: Move[];
}
