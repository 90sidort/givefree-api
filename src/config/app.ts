import { ApolloServer } from "apollo-server-express";
import * as dotenv from "dotenv";
import * as path from "path";
import * as express from "express";
import * as cookieParser from "cookie-parser";
import { isAuth } from "../middleware/authCookie";
import { schema } from "./schema";

const configPath = path.resolve(process.cwd(), `.env.${process.env.MODE}`);
dotenv.config({ path: configPath });

const serverConfig = {
  schema,
  formatError: (error) => {
    console.log(error);
    return error;
  },
  context: ({ req, res }: any) => ({ req, res }),
};

const app = express();
app.use(cookieParser());
app.use(isAuth);
app.use(express.static("images"));

const server = new ApolloServer(serverConfig);

server.applyMiddleware({
  app,
  path: "/graphql",
  cors: { origin: process.env.FRONT_URL, credentials: true },
});

export default app;
