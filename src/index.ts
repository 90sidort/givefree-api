import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import { ApolloServer } from "apollo-server-express";

import { schema } from "./schema";
import { isAuth } from "./middleware/auth";

const startServer = async () => {
  const server = new ApolloServer({
    schema,
    context: ({ req }) => ({ isAuth: req.isAuth, userId: req.userId }),
  });

  await createConnection();

  const app = express();
  app.use(isAuth);

  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
};

startServer();
