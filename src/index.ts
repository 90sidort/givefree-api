import "reflect-metadata";
import * as path from "path";
import * as dotenv from "dotenv";
import { createServer, Server } from "http";
import { createConnection } from "typeorm";

import { config } from "./config/config";
import app from "./config/app";

const configPath = path.resolve(process.cwd(), `.env.${process.env.MODE}`);
dotenv.config({ path: configPath });

const httpServer: Server = createServer(app);

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
  httpServer.listen({ port: process.env.PORT }, (): void =>
    console.log(
      `🚀GraphQL is now running on http://localhost:${process.env.PORT}/graphql`
    )
  );
};

startServer();
