import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Query {
    getUser(id: Int!): User
  }
  type Mutation {
    addUser(
      username: String!,
      name: String!,
      surname: String!,
      email: String!,
      about: String!,
      active: Boolean
    ): Boolean!
  }

  type User {
    id: Int!
    username: String!,
    name: String!,
    surname: String!,
    email: String!,
    about: String!,
    active: Boolean!
  }
`;
