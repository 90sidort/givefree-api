import { createTestClient } from "apollo-server-integration-testing";

import server from "../../src/config/server";

const testServer = server;
const testClient = createTestClient({ apolloServer: testServer });

export default testClient;
