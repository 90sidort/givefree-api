import * as path from "path";
import * as dotenv from "dotenv";
import { ConnectionOptions } from "typeorm";

import { Item } from "./../../src/entity/Item";
import { Image } from "../../src/entity/Image";
import { User } from "../../src/entity/User";

const pathEnv = process.env.MODE === "dev" ? ".env" : ".env.test";
const configPath = path.resolve(process.cwd(), pathEnv);
dotenv.config({ path: configPath });

export const config: ConnectionOptions = {
  name: "fixtures",
  type: "postgres",
  host: `${process.env.HOST_DB}`,
  port: (`${process.env.PORT_DB}` as unknown) as number,
  username: `${process.env.POSTGRES_USER}`,
  password: `${process.env.POSTGRES_PASSWORD}`,
  database: `${process.env.POSTGRES_DB}`,
  entities: [Item, User, Image],
  synchronize: true,
  dropSchema: true,
};
