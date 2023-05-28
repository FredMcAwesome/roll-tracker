import { Entity, Enum, EnumType, PrimaryKey, Property } from "@mikro-orm/core";
import { AdvantageEnum, PlayerEnum, RollTypeEnum } from "../utils/definitions";

@Entity()
export class Rolls {
  @PrimaryKey()
  _id!: number;

  @Enum({ type: EnumType, items: () => PlayerEnum })
  player!: PlayerEnum;

  @Enum({ type: EnumType, items: () => RollTypeEnum })
  rollType!: RollTypeEnum;

  @Enum({ type: EnumType, items: () => AdvantageEnum })
  advantageStatus!: AdvantageEnum;

  @Property({ nullable: true })
  naturalRoll?: number;

  @Property({ nullable: true })
  naturalRollAdvantage?: number;

  @Property({ nullable: true })
  finalRoll?: number;

  @Property({ nullable: true })
  hit?: boolean;

  @Property({ nullable: true })
  rollBonus?: number;

  @Property({ nullable: true })
  damage?: number;

  @Property({ nullable: true })
  damageBonus?: number;

  @Property()
  note!: string;

  @Property()
  session!: number;
}
