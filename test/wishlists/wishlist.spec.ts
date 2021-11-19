import * as supertest from "supertest";

import { config } from "../../src/config/config";
import { loadFixtures } from "../../fixtures/loadScript";
import connectionTestMethods from "../config/testServerMethods";
import { SIGNIN } from "../users/user.queries";
import {
  GET_WISHLIST,
  GET_WISHERS,
  ADD_ITEM_TO_WISHLIST,
  REMOVE_FROM_WISHLIST,
  GIVE_ITEM,
} from "./wishlist.queries";

import app from "../../src/config/app";

const request = supertest(app);

describe("Wishlist tests", () => {
  let tokenCookie: string = "";
  let adminCookie: string = "";
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
    const responseAdmin = await request
      .post("/graphql")
      .send({
        query: SIGNIN,
        variables: { username: "admin", password: "testtest2" },
      })
      .set("Accept", "application/json");
    adminCookie = responseAdmin.headers["set-cookie"][0].split(" Path=/")[0];
  });
  afterAll(async () => {
    await connectionTestMethods.closeDB();
  });
  it("Should be able to get own wishlist", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: GET_WISHLIST,
        variables: { userId: 11123 },
      })
      .set("Cookie", tokenCookie)
      .set("Accept", "application/json");
    expect(response.body.data.getWishlist.length).toBe(7);
    expect(response.body.data.getWishlist[0]).toMatchObject({
      id: expect.any(Number),
      name: expect.any(String),
      category: expect.any(String),
      state: expect.any(String),
      images: [
        {
          url: expect.any(String),
          alt: expect.any(String),
        },
      ],
    });
  });
  it("Should not be able to get other user wishlist", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: GET_WISHLIST,
        variables: { userId: 11122 },
      })
      .set("Cookie", tokenCookie)
      .set("Accept", "application/json");
    expect(response.body.errors[0].message).toBe(
      "Error: Can't see other user wishlist!"
    );
  });
  it("Should not be able to get other user wishlist", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: GET_WISHLIST,
        variables: { userId: 11122 },
      })
      .set("Cookie", tokenCookie)
      .set("Accept", "application/json");
    expect(response.body.errors[0].message).toBe(
      "Error: Can't see other user wishlist!"
    );
  });
  it("Should return wishlist if it is empty", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: GET_WISHLIST,
        variables: { userId: 11122 },
      })
      .set("Cookie", adminCookie)
      .set("Accept", "application/json");
    expect(response.body.data.getWishlist.length).toBe(0);
  });
  it("Should be able to get wishers for valid item", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: GET_WISHERS,
        variables: { itemId: 11220 },
      })
      .set("Cookie", adminCookie)
      .set("Accept", "application/json");
    expect(response.body.data.getWishers.length).toBe(5);
    expect(response.body.data.getWishers[0]).toMatchObject({
      id: expect.any(Number),
      username: expect.any(String),
    });
  });
  it("Should get empty array for item with no wishers", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: GET_WISHERS,
        variables: { itemId: 1167 },
      })
      .set("Cookie", adminCookie)
      .set("Accept", "application/json");
    expect(response.body.data.getWishers.length).toBe(0);
  });
  it("Should return error if item id invalid", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: GET_WISHERS,
        variables: { itemId: 89 },
      })
      .set("Cookie", adminCookie)
      .set("Accept", "application/json");
    expect(response.body.errors[0].message).toBe("Error: Item not found!");
  });
  it("Should be able to add item to wishlist", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: ADD_ITEM_TO_WISHLIST,
        variables: { itemId: 1136 },
      })
      .set("Cookie", adminCookie)
      .set("Accept", "application/json");
    expect(response.body.data).toMatchObject({ addToWishlist: true });
  });
  it("Should return error if added item is already on wishlist", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: ADD_ITEM_TO_WISHLIST,
        variables: { itemId: 11195 },
      })
      .set("Cookie", tokenCookie)
      .set("Accept", "application/json");
    expect(response.body.errors[0].message).toBe(
      "Error: User already added this item to wishlist!"
    );
  });
  it("Should return error if added item is already on wishlist", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: ADD_ITEM_TO_WISHLIST,
        variables: { itemId: 11201 },
      })
      .set("Cookie", tokenCookie)
      .set("Accept", "application/json");
    expect(response.body.errors[0].message).toBe(
      "Error: Cannot give item to yourself!"
    );
  });
  it("Should return error if item does not exist", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: ADD_ITEM_TO_WISHLIST,
        variables: { itemId: 89 },
      })
      .set("Cookie", tokenCookie)
      .set("Accept", "application/json");
    expect(response.body.errors[0].message).toBe("Error: Item not found!");
  });
  it("Should return error if item is not for grabs", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: ADD_ITEM_TO_WISHLIST,
        variables: { itemId: 11221 },
      })
      .set("Cookie", tokenCookie)
      .set("Accept", "application/json");
    expect(response.body.errors[0].message).toBe("Error: Item not for grabs!");
  });
  it("Should be able to remove item from wishlist", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: REMOVE_FROM_WISHLIST,
        variables: { itemId: 111 },
      })
      .set("Cookie", tokenCookie)
      .set("Accept", "application/json");
    expect(response.body.data).toMatchObject({ removeFromWishlist: true });
  });
  it("Should return error if item does not exist (when trying to remove it from wishlist)", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: REMOVE_FROM_WISHLIST,
        variables: { itemId: 83 },
      })
      .set("Cookie", tokenCookie)
      .set("Accept", "application/json");
    expect(response.body.errors[0].message).toBe("Error: Item not found!");
  });
  it("Should not be able to give item that does not exist", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: GIVE_ITEM,
        variables: { userId: 11119, itemId: 89 },
      })
      .set("Cookie", tokenCookie)
      .set("Accept", "application/json");
    expect(response.body.errors[0].message).toBe("Error: Item not found!");
  });
  it("Should not be able to give item to yourself", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: GIVE_ITEM,
        variables: { userId: 11123, itemId: 11219 },
      })
      .set("Cookie", tokenCookie)
      .set("Accept", "application/json");
    expect(response.body.errors[0].message).toBe(
      "Error: Cannot give item to yourself!"
    );
  });
  it("Should not be able to give already given item", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: GIVE_ITEM,
        variables: { userId: 11122, itemId: 11221 },
      })
      .set("Cookie", tokenCookie)
      .set("Accept", "application/json");
    expect(response.body.errors[0].message).toBe(
      "Error: Cannot give draft or already given item!"
    );
  });
  it("Should not be able to give item to user that does not exist", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: GIVE_ITEM,
        variables: { userId: 89, itemId: 11220 },
      })
      .set("Cookie", tokenCookie)
      .set("Accept", "application/json");
    expect(response.body.errors[0].message).toBe("Error: User not found!");
  });
  it("Should be able to give item away", async () => {
    const response = await request
      .post("/graphql")
      .send({
        query: GIVE_ITEM,
        variables: { userId: 11119, itemId: 11220 },
      })
      .set("Cookie", tokenCookie)
      .set("Accept", "application/json");
    expect(response.body.data).toMatchObject({ giveItem: { id: 11220 } });
  });
});
