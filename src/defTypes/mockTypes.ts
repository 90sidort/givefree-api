import { gql } from "apollo-server-express";

export const mockTypeDefs = gql`
  extend type Mutation {
    mockDb: Boolean!
  }
`;
