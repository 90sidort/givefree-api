import { config } from "../../src/config";
import { loadFixtures } from "../../fixtures/loadScript";
import testClient from "../config/testClient";
import connectionTestMethods from "../config/testServerMethods";
import { GET_ITEMS } from "./user.queries";

const { query } = testClient;

describe("Tests for users", () => {
  beforeAll(async () => {
    const connection = await connectionTestMethods.openDB(config);
    await loadFixtures(connection);
  });
  afterAll(async () => {
    await connectionTestMethods.closeDB();
  });
  it("Test", async () => {
    const response = await query({ query: GET_ITEMS, variables: { id: 1111 } });
    console.log(response.data.getUser);
  });
});
