import { config } from "../../src/config";
import { loadFixtures } from "../../fixtures/loadScript";
import testClient from "../config/testClient";
import connectionTestMethods from "../config/testServerMethods";
import {
  // GET_USER,
  SIGNIN,
} from "./user.queries";
import {
  // getUserObj,
  loginInputObj,
} from "./user.variables";
const {
  // query,
  mutate,
} = testClient;

describe("User tests", () => {
  beforeAll(async () => {
    const connection = await connectionTestMethods.openDB(config);
    await loadFixtures(connection);
  });
  afterAll(async () => {
    await connectionTestMethods.closeDB();
  });
  // it("Should be able to get user by id", async () => {
  //   const response = await query({ query: GET_USER, variables: { id: 111 } });
  //   expect(response.data.getUser).toMatchObject(getUserObj);
  // });
  // it("Should return error if user does not exist", async () => {
  //   const response = await query({ query: GET_USER, variables: { id: 1 } });
  //   if (response?.errors)
  //     expect(response.errors[0].message).toBe("User does not exist!");
  // });
  it("Should be able to log in", async () => {
    const response = await mutate(SIGNIN, {
      variables: loginInputObj,
    });
    console.log(response.data);
    expect(response.data).toMatchObject({
      signinUser: expect.any(String),
    });
  });
});
