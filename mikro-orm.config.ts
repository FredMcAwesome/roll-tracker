import { Options } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Rolls } from "./entities/rolls";

const dbOptions: Options<PostgreSqlDriver> = {
  entities: [Rolls],
  type: "postgresql",
  dbName: "db",
  password: "password",
  port: 5435,
  forceUndefined: true,
};

export default dbOptions;
