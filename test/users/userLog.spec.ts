import { config } from "../../src/config";
import { loadFixtures } from "../../fixtures/loadScript";
import testClient from "../config/testClient";
import connectionTestMethods from "../config/testServerMethods";
import { GET_USER, SIGNIN, ME_QUERY } from "./user.queries";
import { getUserObj, loginInputObj, getMeObj } from "./user.variables";
const { query, mutate, setOptions } = testClient;

describe("User tests with login", () => {
  let token: string = "";
  beforeAll(async () => {
    const connection = await connectionTestMethods.openDB(config);
    await loadFixtures(connection);
    const response = await mutate(SIGNIN, {
      variables: loginInputObj,
    });
    token = response.data["signinUser"];
  });
  setOptions({
    request: {
      cookies: {
        token,
      },
      isAuth: true,
      userId: 11122,
    },
  });
  afterAll(async () => {
    await connectionTestMethods.closeDB();
  });
  it("Should be able to get user by id", async () => {
    const response = await query(GET_USER, { variables: { id: 111 } });
    expect(response.data).toMatchObject(getUserObj);
  });
  it("Should return error if user does not exist", async () => {
    const response = await query(GET_USER, { variables: { id: 1 } });
    if (response?.errors)
      expect(response.errors[0].message).toBe("Error: User does not exist!");
  });
  it("Should be able to get me data when logged in", async () => {
    const response = await query(ME_QUERY);
    expect(response.data).toMatchObject(getMeObj);
  });
});
