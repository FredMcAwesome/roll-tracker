import { RequestContext } from "@mikro-orm/core";
import { MikroORM } from "@mikro-orm/postgresql";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import config from "../mikro-orm.config";

declare global {
  var __MikroORM__: MikroORM;
}

const getORM = async () => {
  if (!global.__MikroORM__) {
    global.__MikroORM__ = await MikroORM.init(config);
  }
  return global.__MikroORM__;
};

export default getORM;
