import * as path from "path";
import * as dotenv from "dotenv";
import { ConnectionOptions } from "typeorm";

import { Image } from "../entity/Image";
import { User } from "../entity/User";
import { Item } from "../entity/Item";
const pathEnv = process.env.MODE === "dev" ? ".env" : ".env.test";
const configPath = path.resolve(process.cwd(), pathEnv);
dotenv.config({ path: configPath });

export const config: ConnectionOptions = {
  type: "postgres",
  host: `${process.env.HOST_DB}`,
  port: (`${process.env.PORT_DB}` as unknown) as number,
  username: `${process.env.POSTGRES_USER}`,
  password: `${process.env.POSTGRES_PASSWORD}`,
  database: `${process.env.POSTGRES_DB}`,
  entities: [User, Image, Item],
  synchronize: process.env.ENVIRONMENT === "production" ? false : true,
  dropSchema: process.env.ENVIRONMENT !== "develop" ? true : false,
};
