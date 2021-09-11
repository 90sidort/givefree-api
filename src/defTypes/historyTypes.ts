import { gql } from "apollo-server-express";

export const historyTypeDefs = gql`
  extend type Query {
    getTaken(userId: Int!, skip: Int, first: Int): [Item]!
    getGiven(userId: Int!, skip: Int, first: Int): [Item]!
  }
`;
