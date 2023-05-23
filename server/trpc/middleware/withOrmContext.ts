import { RequestContext } from "@mikro-orm/core";
import getORM from "../../../utils/orm";
import { middleware } from "../trpc";

/**
 * Add RequestContext for MikroORM to isolate Identity Map per request.
 */
export const withOrmContext = middleware(async ({ ctx, next }) => {
  const orm = await getORM();

  return RequestContext.createAsync(orm.em, () =>
    next({ ctx: { ...ctx, orm } })
  );
});

export default withOrmContext;
