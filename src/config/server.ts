import { ApolloServer } from "apollo-server-express";
import * as dotenv from "dotenv";
import * as path from "path";

import { schema } from "../schema";
const configPath = path.resolve(process.cwd(), `.env.${process.env.MODE}`);
dotenv.config({ path: configPath });
import app from "./app";

const serverConfig = {
  schema,
  formatError: (error) => {
    console.log(error);
    return error;
  },
  context: ({ req, res }: any) => ({ req, res }),
};

const server = new ApolloServer(serverConfig);

server.applyMiddleware({
  app,
  path: "/graphql",
  cors: { origin: process.env.FRONT_URL, credentials: true },
});

export default server;
