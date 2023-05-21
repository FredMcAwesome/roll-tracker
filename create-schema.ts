import { MikroORM, Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

const dbOptions: Options<PostgreSqlDriver> = {
  entities: ['./dist/**/*.entity.js'],
  type: 'postgresql',
  port: 5435,
  dbName: 'db',
  password: 'password',
  forceUndefined: true,
};

(async () => {
  const orm = await MikroORM.init<PostgreSqlDriver>(dbOptions);
  const generator = orm.getSchemaGenerator();
  // const dropDump = await generator.getDropSchemaSQL();
  // console.log(dropDump);
  // const createDump = await generator.getCreateSchemaSQL();
  // console.log(createDump);
  // const updateDump = await generator.getUpdateSchemaSQL();
  // console.log(updateDump);

  // run queries directly, but be sure to check the above first to ensure format is correct
  await generator.dropSchema();
  await generator.createSchema();
  // await generator.updateSchema();

  await orm.close(true);
})();
