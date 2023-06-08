import { Options } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { IsThatRainResults } from "./entities/isThatRain";
import { Rolls } from "./entities/rolls";

const dbOptions: Options<PostgreSqlDriver> = {
  entities: [Rolls, IsThatRainResults],
  type: "postgresql",
  dbName: "db",
  password: "password",
  port: 5435,
  forceUndefined: true,
};

export default dbOptions;
