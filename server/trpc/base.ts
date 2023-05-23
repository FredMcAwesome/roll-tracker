import withOrmContext from "./middleware/withOrmContext";
import { procedure } from "./trpc";

export const baseProcedure = procedure.use(withOrmContext);
