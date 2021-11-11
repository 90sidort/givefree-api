import * as supertest from "supertest";

import { config } from "../../src/config/config";
import { loadFixtures } from "../../fixtures/loadScript";
import connectionTestMethods from "../config/testServerMethods";
import { SIGNIN } from "../users/user.queries";
import { ADD_ITEM, UPDATE_ITEM, DELETE_ITEM } from "./item.queries";
import {
  itemNew,
  itemAdded,
  updateItemObj,
  itemUpdated,
  deletedItem,
} from "./item.variables";

import app from "../../src/config/app";

const request = supertest(app);

describe("Item create, update and delete tests", () => {
  let tokenCookie: string = "";
  beforeAll(async () => {
    const connection = await connectionTestMethods.openDB(config);
    await loadFixtures(connection);
    const response = await request
      .post("/graphql")
      .send({
        query: SIGNIN,
        variables: { username: "normal_user", password: "testtest2" },
      })
      .set("Accept", "application/json");
    tokenCookie = response.headers["set-cookie"][0].split(" Path=/")[0];
  });
  afterAll(async () => {
    await connectionTestMethods.closeDB();
  });
  it("Should be able to create item with valid data", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: ADD_ITEM,
        variables: itemNew,
      })
      .set("Cookie", tokenCookie)
      .set("Accept", "application/json");
    expect(response.body.data).toMatchObject(itemAdded);
  });
  it("Should not be able to create item with invalid data", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: ADD_ITEM,
        variables: { item: { ...itemNew.item, name: "aa" } },
      })
      .set("Cookie", tokenCookie)
      .set("Accept", "application/json");
    expect(response.body.errors[0].message).toBe(
      "Error: Item name: aa is not between 4 and 400 characters long!"
    );
  });
  it("Should not be able to create item without login in", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: ADD_ITEM,
        variables: itemNew,
      })
      .set("Accept", "application/json");
    expect(response.body.errors[0].message).toBe("Error: Unauthorized!");
  });
  it("Should be able to update item with valid data", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: UPDATE_ITEM,
        variables: updateItemObj,
      })
      .set("Cookie", tokenCookie)
      .set("Accept", "application/json");
    expect(response.body.data).toMatchObject(itemUpdated);
  });
  it("Should not be able to update item that does not exist", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: UPDATE_ITEM,
        variables: {
          id: 11,
          item: { ...updateItemObj.item },
        },
      })
      .set("Cookie", tokenCookie)
      .set("Accept", "application/json");
    expect(response.body.errors[0].message).toBe("Error: Item does not exist!");
  });
  it("Should not be able to update item with invalid data", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: UPDATE_ITEM,
        variables: {
          id: updateItemObj.id,
          item: { ...updateItemObj.item, name: "aa" },
        },
      })
      .set("Cookie", tokenCookie)
      .set("Accept", "application/json");
    expect(response.body.errors[0].message).toBe(
      "Error: Item name: aa is not between 4 and 400 characters long!"
    );
  });
  it("Should not be able to update item without login in", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: UPDATE_ITEM,
        variables: {
          id: updateItemObj.id,
          item: { ...updateItemObj.item, name: "aa" },
        },
      })
      .set("Accept", "application/json");
    expect(response.body.errors[0].message).toBe("Error: Unauthorized!");
  });
  it("Should not be able to update other users item", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: UPDATE_ITEM,
        variables: {
          id: 1113,
          item: { ...updateItemObj.item },
        },
      })
      .set("Cookie", tokenCookie)
      .set("Accept", "application/json");
    expect(response.body.errors[0].message).toBe(
      "Error: Cannot change other user item!"
    );
  });
  it("Should not be able to update already given item", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: UPDATE_ITEM,
        variables: {
          id: 11237,
          item: { ...updateItemObj.item },
        },
      })
      .set("Cookie", tokenCookie)
      .set("Accept", "application/json");
    expect(response.body.errors[0].message).toBe("Error: Item alread given!");
  });
  it("Should be able to delete item", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: DELETE_ITEM,
        variables: { id: 11220 },
      })
      .set("Cookie", tokenCookie)
      .set("Accept", "application/json");
    expect(response.body.data).toMatchObject(deletedItem);
  });
  it("Should not be able to delete item without login in", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: DELETE_ITEM,
        variables: { id: 11220 },
      })
      .set("Accept", "application/json");
    expect(response.body.errors[0].message).toBe("Error: Unauthorized!");
  });
  it("Should not be able to delete other user item", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: DELETE_ITEM,
        variables: { id: 11260 },
      })
      .set("Cookie", tokenCookie)
      .set("Accept", "application/json");
    expect(response.body.errors[0].message).toBe(
      "Error: Cannot delete other user item!"
    );
  });
  it("Should not be able to delete item that does not exist", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: DELETE_ITEM,
        variables: { id: 11 },
      })
      .set("Cookie", tokenCookie)
      .set("Accept", "application/json");
    expect(response.body.errors[0].message).toBe("Error: Item does not exist!");
  });
  it("Should not be able to delete already given item", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: DELETE_ITEM,
        variables: { id: 11238 },
      })
      .set("Cookie", tokenCookie)
      .set("Accept", "application/json");
    expect(response.body.errors[0].message).toBe(
      "Error: Cannot delete archived item!"
    );
  });
});
