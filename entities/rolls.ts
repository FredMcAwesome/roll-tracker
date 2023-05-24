import { Entity, Enum, EnumType, PrimaryKey, Property } from "@mikro-orm/core";
import { PlayerEnum, RollTypeEnum } from "../utils/definitions";

@Entity()
export class Rolls {
  @PrimaryKey()
  _id!: number;

  @Enum({ type: EnumType, items: () => PlayerEnum })
  player!: PlayerEnum;

  @Enum({ type: EnumType, items: () => RollTypeEnum })
  rollType!: RollTypeEnum;

  @Property({ nullable: true })
  total?: number;

  @Property({ nullable: true })
  damage?: number;

  @Property()
  note!: string;
}
