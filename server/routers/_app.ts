import { QueryOrder } from "@mikro-orm/core";
import { z } from "zod";
import { IsThatRainResults } from "../../entities/isThatRain";
import { Rolls } from "../../entities/rolls";
import {
  AdvantageEnum,
  PlayerEnum,
  RollTypeEnum,
  zodPlayerEnum,
} from "../../utils/definitions";
import { baseProcedure } from "../trpc/base";
import { router } from "../trpc/trpc";
export const appRouter = router({
  getRows: baseProcedure.input(z.number()).query(async (opts) => {
    const orm = opts.ctx.orm;
    const whereClause = opts.input === 0 ? {} : { session: opts.input };
    const rows = await orm.em.find(Rolls, whereClause, {
      orderBy: { _id: QueryOrder.DESC },
    });

    return {
      rows: rows,
    };
  }),

  postRow: baseProcedure
    .input(
      z.object({
        player: z.nativeEnum(PlayerEnum),
        rollType: z.nativeEnum(RollTypeEnum),
        advantageStatus: z.nativeEnum(AdvantageEnum),
        naturalRoll: z.optional(z.number()),
        naturalRollAdvantage: z.optional(z.number()),
        finalRoll: z.optional(z.number()),
        hit: z.optional(z.boolean()),
        damage: z.optional(z.number()),
        note: z.string(),
        session: z.number(),
      })
    )
    .mutation(async (opts) => {
      console.log(opts.input.hit);
      const orm = opts.ctx.orm;
      const roll = advantageChecker({ ...opts.input, _id: 0 });
      const row = orm.em.create(Rolls, {
        player: roll.player,
        rollType: roll.rollType,
        advantageStatus: roll.advantageStatus,
        ...(roll.naturalRoll !== undefined && {
          naturalRoll: roll.naturalRoll,
        }),
        ...(roll.naturalRollAdvantage !== undefined && {
          naturalRollAdvantage: roll.naturalRollAdvantage,
        }),
        ...(roll.finalRoll !== undefined && {
          finalRoll: roll.finalRoll,
        }),
        ...(roll.hit !== undefined && {
          hit: roll.hit,
        }),
        ...(roll.damage !== undefined && { damage: roll.damage }),
        note: roll.note,
        session: roll.session,
      });
      await orm.em.persistAndFlush(row);
      console.log(row);
    }),

  updateRow: baseProcedure
    .input(
      z.object({
        _id: z.number(),
        player: z.nativeEnum(PlayerEnum),
        rollType: z.nativeEnum(RollTypeEnum),
        advantageStatus: z.nativeEnum(AdvantageEnum),
        naturalRoll: z.optional(z.number()),
        naturalRollAdvantage: z.optional(z.number()),
        finalRoll: z.optional(z.number()),
        hit: z.optional(z.boolean()),
        damage: z.optional(z.number()),
        note: z.string(),
      })
    )
    .mutation(async (opts) => {
      const orm = opts.ctx.orm;
      const roll = advantageChecker({ ...opts.input, session: 0 });
      const ref = orm.em.getReference(Rolls, roll._id);
      ref.player = roll.player;
      ref.rollType = roll.rollType;
      ref.advantageStatus = roll.advantageStatus;
      if (roll.naturalRoll !== undefined) ref.naturalRoll = roll.naturalRoll;
      // overwrite incorrect advantage
      if (
        roll.naturalRollAdvantage !== undefined ||
        ref.naturalRollAdvantage !== undefined
      )
        ref.naturalRollAdvantage = roll.naturalRollAdvantage;
      if (roll.finalRoll !== undefined) ref.finalRoll = roll.finalRoll;
      if (roll.hit !== undefined) ref.hit = roll.hit;
      if (roll.damage !== undefined) ref.damage = roll.damage;
      ref.note = roll.note;
      await orm.em.flush();
    }),

  deleteRow: baseProcedure
    .input(
      z.object({
        _id: z.number(),
      })
    )
    .mutation(async (opts) => {
      const orm = opts.ctx.orm;
      const roll = opts.input;
      const ref = orm.em.getReference(Rolls, roll._id);
      await orm.em.remove(ref).flush();
    }),

  getIsThatRain: baseProcedure.input(z.number()).query(async (opts) => {
    const orm = opts.ctx.orm;
    const playerResult = await orm.em.findOne(IsThatRainResults, {
      session: opts.input,
    });
    const player = playerResult === null ? "None" : playerResult.player;

    return player;
  }),
  setIsThatRain: baseProcedure
    .input(
      z.object({
        session: z.number(),
        player: zodPlayerEnum,
      })
    )
    .mutation(async (opts) => {
      const orm = opts.ctx.orm;
      const session = opts.input.session;
      const player = opts.input.player;
      const rainSession = await orm.em.findOne(IsThatRainResults, {
        session: session,
      });
      if (rainSession !== null) {
        rainSession.player = player;
      } else {
        const rain = orm.em.create(IsThatRainResults, {
          session: session,
          player: player,
        });
        orm.em.persist(rain);
        console.log(rain);
      }
      await orm.em.flush();
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;

function advantageChecker(roll: {
  player: PlayerEnum;
  rollType: RollTypeEnum;
  advantageStatus: AdvantageEnum;
  note: string;
  session: number;
  naturalRoll?: number | undefined;
  naturalRollAdvantage?: number | undefined;
  finalRoll?: number | undefined;
  hit?: boolean | undefined;
  damage?: number | undefined;
  _id: number;
}) {
  if (roll.naturalRollAdvantage !== undefined) {
    const temp = roll.naturalRollAdvantage;
    // make naturalRoll be the chosen base roll
    if (roll.naturalRoll !== undefined) {
      if (
        (roll.advantageStatus == AdvantageEnum.advantage &&
          roll.naturalRoll < roll.naturalRollAdvantage) ||
        (roll.advantageStatus == AdvantageEnum.disadvantage &&
          roll.naturalRoll > roll.naturalRollAdvantage)
      ) {
        roll.naturalRollAdvantage = roll.naturalRoll;
        roll.naturalRoll = temp;
      }
    }
    // clear advantage roll if not allowed
    if (roll.advantageStatus === AdvantageEnum.normal) {
      roll.naturalRollAdvantage = undefined;
    }
  }
  return roll;
}
