import { createTestClient } from "apollo-server-testing";
import { ApolloServer } from "apollo-server-express";

import { serverConfig } from "../../src/config/server";

const testServer = new ApolloServer(serverConfig);
const testClient = createTestClient(testServer as any);

export default testClient;
