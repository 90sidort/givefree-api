import { gql } from "apollo-server-express";

export const wishlistTypeDefs = gql`
  extend type Query {
    getWishlist(userId: Int!): [Item]
    getWishers(itemId: Int!): [User]
    getTakenGiven(userId: Int!, taken: Boolean!): User!
  }
  extend type Mutation {
    addToWishlist(itemId: Int!): Boolean!
    removeFromWishlist(itemId: Int!): Boolean!
    giveItem(userId: Int!, itemId: Int): Boolean!
  }
`;
