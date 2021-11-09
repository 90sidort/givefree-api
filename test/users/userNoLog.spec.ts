import * as supertest from "supertest";

import { config } from "../../src/config/config";
import { loadFixtures } from "../../fixtures/loadScript";
import connectionTestMethods from "../config/testServerMethods";
import {
  SIGNIN,
  ME_QUERY,
  GET_USER,
  REQUEST_RESET,
  SIGNUP,
} from "./user.queries";
import { loginInputObj, signupInputObj } from "./user.variables";
import app from "../../src/config/app";

const request = supertest(app);

describe("User tests without login", () => {
  beforeAll(async () => {
    const connection = await connectionTestMethods.openDB(config);
    await loadFixtures(connection);
  });
  afterAll(async () => {
    await connectionTestMethods.closeDB();
  });
  it("Should be able to log in", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: SIGNIN,
        variables: { ...loginInputObj },
      })
      .set("Accept", "application/json");
    expect(response.body.data).toMatchObject({
      signinUser: expect.any(String),
    });
  });
  it("Should return error in me query if userId is empty", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: ME_QUERY,
      })
      .set("Accept", "application/json");
    expect(response.body.errors[0].message).toBe("Error: User not logged in!");
  });
  it("Should return error in get user query with no authorization", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: GET_USER,
        variables: { id: 11122 },
      })
      .set("Accept", "application/json");
    expect(response.body.errors[0].message).toBe("Error: Unauthorized!");
  });

  it("Should not be able to request password reset for user that does not exist", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: REQUEST_RESET,
        variables: { email: "test1111@test.com" },
      })
      .set("Accept", "application/json");
    expect(response.body.errors[0].message).toBe(
      "Error: User with email: test1111@test.com does not exist!"
    );
  });
  it("Should be able to request password reset", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: REQUEST_RESET,
        variables: { email: "test@test.com" },
      })
      .set("Accept", "application/json");
    expect(response.body.data).toMatchObject({
      requestReset: true,
    });
  });
  it("Should be able to signup", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: SIGNUP,
        variables: { ...signupInputObj },
      })
      .set("Accept", "application/json");
    expect(response.body.data).toMatchObject({
      signupUser: expect.any(String),
    });
  });
  it("Should not be able to signup if email taken", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: SIGNUP,
        variables: {
          ...signupInputObj,
          username: "changedUsername",
          email: "test@test.com",
        },
      })
      .set("Accept", "application/json");
    expect(response.body.errors[0].message).toBe(
      "Error: User with email test@test.com already exists!"
    );
  });
  it("Should not be able to signup if username taken", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: SIGNUP,
        variables: {
          ...signupInputObj,
          username: "admin",
          email: "admin@admin.com",
        },
      })
      .set("Accept", "application/json");
    expect(response.body.errors[0].message).toBe(
      "Error: User admin already exists!"
    );
  });
});
