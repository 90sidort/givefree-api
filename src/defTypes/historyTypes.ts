import { gql } from "apollo-server-express";

export const historyTypeDefs = gql`
  extend type Query {
    getTaken(userId: Int!): [Item]!
    getGiven(userId: Int!): [Item]!
  }
`;
