import { QueryOrder } from "@mikro-orm/core";
import { z } from "zod";
import { Rolls } from "../../entities/rolls";
import {
  AdvantageEnum,
  PlayerEnum,
  RollTypeEnum,
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
        damage: z.optional(z.number()),
        note: z.string(),
        session: z.number(),
      })
    )
    .mutation(async (opts) => {
      const orm = opts.ctx.orm;
      const roll = opts.input;
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
        damage: z.optional(z.number()),
        note: z.string(),
      })
    )
    .mutation(async (opts) => {
      const orm = opts.ctx.orm;
      const roll = opts.input;
      const ref = orm.em.getReference(Rolls, roll._id);
      ref.player = roll.player;
      ref.rollType = roll.rollType;
      ref.advantageStatus = roll.advantageStatus;
      if (roll.naturalRoll !== undefined) ref.naturalRoll = roll.naturalRoll;
      if (roll.naturalRollAdvantage !== undefined)
        ref.naturalRollAdvantage = roll.naturalRollAdvantage;
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
});
// export type definition of API
export type AppRouter = typeof appRouter;
