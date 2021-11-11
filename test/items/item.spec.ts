import * as supertest from "supertest";

import { config } from "../../src/config/config";
import { loadFixtures } from "../../fixtures/loadScript";
import connectionTestMethods from "../config/testServerMethods";
import { SIGNIN } from "../users/user.queries";
import { GET_ITEM, GET_ITEMS_SEARCH } from "./item.queries";
import { loginInputObj } from "../users/user.variables";
import {
  item111,
  itemsSearchItems,
  itemsSearchRes,
  itemsSearchGiving,
  itemsSearchTaken,
  itemsSearchGiven,
} from "./item.variables";

import app from "../../src/config/app";

const request = supertest(app);

describe("Item tests", () => {
  let tokenCookie: string = "";
  // let norTokenCookie: string = "";
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
    // const responseNor = await request
    //   .post("/graphql")
    //   .send({
    //     query: SIGNIN,
    //     variables: { ...loginInputObj, username: "normal_user" },
    //   })
    //   .set("Accept", "application/json");
    tokenCookie = response.headers["set-cookie"][0].split(" Path=/")[0];
    // norTokenCookie = responseNor.headers["set-cookie"][0].split(" Path=/")[0];
  });
  afterAll(async () => {
    await connectionTestMethods.closeDB();
  });
  it("Should be able to get item data by id", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: GET_ITEM,
        variables: { id: 111 },
      })
      .set("Cookie", tokenCookie)
      .set("Accept", "application/json");
    expect(response.body.data).toMatchObject(item111);
  });
  it("Should throw an error if item with id does not exist", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: GET_ITEM,
        variables: { id: 1 },
      })
      .set("Cookie", tokenCookie)
      .set("Accept", "application/json");
    expect(response.body.errors[0].message).toBe("Error: Item not found");
  });
  it("Should be able to get items matching search criteria (items view)", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: GET_ITEMS_SEARCH,
        variables: itemsSearchItems,
      })
      .set("Cookie", tokenCookie)
      .set("Accept", "application/json");
    expect(response.body.data).toMatchObject(itemsSearchRes);
  });
  it("Should be able to get items matching search criteria (giving view)", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: GET_ITEMS_SEARCH,
        variables: itemsSearchGiving,
      })
      .set("Cookie", tokenCookie)
      .set("Accept", "application/json");
    expect(response.body.data.items).toHaveLength(2);
  });
  it("Should be able to get items matching search criteria (taken view)", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: GET_ITEMS_SEARCH,
        variables: itemsSearchTaken,
      })
      .set("Cookie", tokenCookie)
      .set("Accept", "application/json");
    expect(response.body.data.items).toHaveLength(20);
  });
  it("Should be able to get items matching search criteria (given view)", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: GET_ITEMS_SEARCH,
        variables: itemsSearchGiven,
      })
      .set("Cookie", tokenCookie)
      .set("Accept", "application/json");
    expect(response.body.data.items).toHaveLength(20);
    expect(response.body.data.items[0].name).toBe("Super duper shorts two!");
  });
  it("Should return empty array if no items match search criteria", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: GET_ITEMS_SEARCH,
        variables: {
          input: { ...itemsSearchItems.input, name: "testetsetes" },
        },
      })
      .set("Cookie", tokenCookie)
      .set("Accept", "application/json");
    expect(response.body.data.items).toHaveLength(0);
  });
});
