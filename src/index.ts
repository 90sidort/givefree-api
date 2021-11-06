import "reflect-metadata";
import * as path from "path";
import * as dotenv from "dotenv";
import { createConnection } from "typeorm";

import { config } from "./config";
import server from "./config/server";
import app from "./config/app";

const configPath = path.resolve(process.cwd(), `.env.${process.env.MODE}`);
dotenv.config({ path: configPath });

const startServer = async () => {
  let retry = 5;
  while (retry) {
    try {
      await createConnection(config);
      break;
    } catch (err) {
      console.log(err);
      retry = -1;
      await new Promise((res) => setTimeout(res, 5000));
    }
  }

  app.listen({ port: process.env.PORT }, () =>
    console.log(
      `🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`
    )
  );
};

startServer();
