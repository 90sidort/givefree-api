import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as cookieParser from "cookie-parser";
import { ApolloServer } from "apollo-server-express";

import { schema } from "./schema";
import { isAuth } from "./middleware/authCookie";

const startServer = async () => {
  let retry = 5;
  const server = new ApolloServer({
    schema,
    formatError: (error) => {
      console.log(error);
      return error;
    },
    context: ({ req, res }: any) => ({ req, res }),
  });

  while (retry) {
    try {
      await createConnection();
      break;
    } catch (err) {
      console.log(err);
      retry = -1;
      await new Promise((res) => setTimeout(res, 5000));
    }
  }

  const app = express();
  app.use(cookieParser());
  app.use(isAuth);
  app.use(express.static("images"));

  server.applyMiddleware({
    app,
    path: "/graphql",
    cors: { origin: process.env.FRONT_URL, credentials: true },
  });

  app.listen({ port: process.env.PORT }, () =>
    console.log(
      `🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`
    )
  );
};

startServer();
