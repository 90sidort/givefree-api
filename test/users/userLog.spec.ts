import * as supertest from "supertest";

import { config } from "../../src/config/config";
import { loadFixtures } from "../../fixtures/loadScript";
import connectionTestMethods from "../config/testServerMethods";
import {
  SIGNIN,
  SIGN_OUT,
  ME_QUERY,
  GET_USER,
  UPDATE_USER,
} from "./user.queries";
import {
  loginInputObj,
  getAdminObj,
  getMeObj,
  updateUserObj,
  updatedUserObj,
} from "./user.variables";
import app from "../../src/config/app";

const request = supertest(app);

describe("User tests with login", () => {
  let tokenCookie: string = "";
  let norTokenCookie: string = "";
  beforeAll(async () => {
    const connection = await connectionTestMethods.openDB(config);
    await loadFixtures(connection);
    const response = await request
      .post("/graphql")
      .send({
        query: SIGNIN,
        variables: { ...loginInputObj },
      })
      .set("Accept", "application/json");
    const responseNor = await request
      .post("/graphql")
      .send({
        query: SIGNIN,
        variables: { ...loginInputObj, username: "normal_user" },
      })
      .set("Accept", "application/json");
    tokenCookie = response.headers["set-cookie"][0].split(" Path=/")[0];
    norTokenCookie = responseNor.headers["set-cookie"][0].split(" Path=/")[0];
  });
  afterAll(async () => {
    await connectionTestMethods.closeDB();
  });
  it("Should not be able to update with invalid data", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: UPDATE_USER,
        variables: {
          ...updateUserObj,
          id: 11122,
          newEmail: "wrong!",
        },
      })
      .set("Cookie", tokenCookie)
      .set("Accept", "application/json");
    expect(response.body.errors[0].message).toBe(
      "Error: Email has to be correct!"
    );
  });
  it("Should not be able to update with already existing email", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: UPDATE_USER,
        variables: {
          ...updateUserObj,
          id: 11122,
          newEmail: "nswetmorem@canalblog.com",
        },
      })
      .set("Cookie", tokenCookie)
      .set("Accept", "application/json");
    expect(response.body.errors[0].message).toBe(
      "Error: Email nswetmorem@canalblog.com already taken!"
    );
  });
  it("Should not be able to update other user data", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: UPDATE_USER,
        variables: { ...updateUserObj },
      })
      .set("Cookie", tokenCookie)
      .set("Accept", "application/json");
    expect(response.body.errors[0].message).toBe(
      "Error: Cannot update other user account!"
    );
  });
  it("Should be able to update user data", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: UPDATE_USER,
        variables: { ...updateUserObj },
      })
      .set("Cookie", norTokenCookie)
      .set("Accept", "application/json");
    expect(response.body.data).toMatchObject(updatedUserObj);
  });
  it("Should not be able to get nonexistent user data", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: GET_USER,
        variables: { id: 1 },
      })
      .set("Cookie", tokenCookie)
      .set("Accept", "application/json");
    expect(response.body.errors[0].message).toBe("Error: User does not exist!");
  });
  it("Should be able to get user data by id", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: GET_USER,
        variables: { id: 11122 },
      })
      .set("Cookie", tokenCookie)
      .set("Accept", "application/json");
    expect(response.body.data).toMatchObject({ getUser: getAdminObj });
  });
  it("Should be able to get own account data", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: ME_QUERY,
        variables: {},
      })
      .set("Cookie", tokenCookie)
      .set("Accept", "application/json");
    expect(response.body.data).toMatchObject(getMeObj);
  });
  it("Should be able to log out", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: SIGN_OUT,
        variables: {},
      })
      .set("Cookie", tokenCookie)
      .set("Accept", "application/json");
    expect(response.body.data).toMatchObject({ signout: true });
  });
});
