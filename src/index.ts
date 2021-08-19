import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import { ApolloServer } from "apollo-server-express";

import { schema } from "./schema";
import { isAuth } from "./middleware/auth";

const startServer = async () => {
  const server = new ApolloServer({
    schema,
    formatError: (error) => {
      console.log(error);
      return error;
    },
    context: ({ req }) => ({ isAuth: req.isAuth, userId: req.userId }),
  });

  await createConnection();

  const app = express();
  app.use(isAuth);
  app.use(express.static("images"));

  server.applyMiddleware({ app, path: "/graphql", cors: true });

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
};

startServer();
