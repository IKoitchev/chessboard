import {
  Column,
  DataType,
  Default,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

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
}
