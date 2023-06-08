import { Entity, Enum, EnumType, PrimaryKey, Property } from "@mikro-orm/core";
import { AdvantageEnum, PlayerEnum, RollTypeEnum } from "../utils/definitions";

@Entity()
export class IsThatRainResults {
  @PrimaryKey()
  session!: number;

  @Enum({ type: EnumType, items: () => PlayerEnum })
  player!: PlayerEnum;
}
