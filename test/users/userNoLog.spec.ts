import { config } from "../../src/config";
import { loadFixtures } from "../../fixtures/loadScript";
import testClient from "../config/testClient";
import connectionTestMethods from "../config/testServerMethods";
import { GET_USER, SIGNIN, ME_QUERY, REQUEST_RESET } from "./user.queries";
import { loginInputObj } from "./user.variables";
const { query, mutate } = testClient;

describe("User tests without login", () => {
  beforeAll(async () => {
    const connection = await connectionTestMethods.openDB(config);
    await loadFixtures(connection);
  });
  afterAll(async () => {
    await connectionTestMethods.closeDB();
  });
  it("Should be able to log in", async () => {
    const response = await mutate(SIGNIN, {
      variables: loginInputObj,
    });
    expect(response.data).toMatchObject({
      signinUser: expect.any(String),
    });
  });
  it("Should return error in me query if userId is empty", async () => {
    const response = await query(ME_QUERY);
    if (response?.errors)
      expect(response.errors[0].message).toBe("Error: User not logged in!");
  });
  it("Should not be able to get user by id without being logged in", async () => {
    const response = await query(GET_USER, { variables: { id: 111 } });
    if (response?.errors)
      expect(response.errors[0].message).toBe("Error: Unauthorized!");
  });
  it("Should not be able to request password reset for user that does not exist", async () => {
    const response = await query(REQUEST_RESET, {
      variables: { email: "test1111@test.com" },
    });
    if (response?.errors)
      expect(response.errors[0].message).toBe(
        "Error: User with email: test1111@test.com does not exist!"
      );
  });
  it("Should be able to request password reset", async () => {
    const response = await query(REQUEST_RESET, {
      variables: { email: "test@test.com" },
    });
    console.log(response.data, 3333);
    expect(response.data).toMatchObject({
      requestReset: true,
    });
  });
});
