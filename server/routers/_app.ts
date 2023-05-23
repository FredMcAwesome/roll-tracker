import { QueryOrder } from "@mikro-orm/core";
import { z } from "zod";
import { PlayerEnum, Rolls, RollTypeEnum } from "../../entities/rolls";
import { baseProcedure } from "../trpc/base";
import { router } from "../trpc/trpc";
export const appRouter = router({
  getRows: baseProcedure.query(async (opts) => {
    const orm = opts.ctx.orm;
    const rows = await orm.em.find(
      Rolls,
      {},
      { orderBy: { _id: QueryOrder.DESC } }
    );
    // return rows;

    return {
      rows: rows,
    };
  }),
  postRow: baseProcedure
    .input(
      z.object({
        player: z.nativeEnum(PlayerEnum),
        type: z.nativeEnum(RollTypeEnum),
        total: z.optional(z.number()),
        damage: z.optional(z.number()),
        note: z.string(),
      })
    )
    .mutation((opts) => {
      const orm = opts.ctx.orm;
      const roll = opts.input;
      const row = orm.em.create(Rolls, {
        player: PlayerEnum[roll.player],
        rollType: RollTypeEnum[roll.type],
        ...(roll.total !== undefined && { total: roll.total }),
        ...(roll.damage !== undefined && { damage: roll.damage }),
        note: roll.note,
      });
      orm.em.persistAndFlush(row);
      console.log(row);
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
