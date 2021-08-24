import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as cookieParser from "cookie-parser";
import { ApolloServer } from "apollo-server-express";

import { schema } from "./schema";
import { isAuth } from "./middleware/authCookie";

const startServer = async () => {
  const server = new ApolloServer({
    schema,
    formatError: (error) => {
      console.log(error);
      return error;
    },
    context: ({ req, res }: any) => ({ req, res }),
  });

  await createConnection();

  const app = express();
  app.use(cookieParser());
  app.use(isAuth);
  app.use(express.static("images"));

  server.applyMiddleware({
    app,
    path: "/graphql",
    cors: { origin: "http://localhost:7777", credentials: true },
  });

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
};

startServer();
