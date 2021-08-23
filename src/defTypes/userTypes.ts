import { gql } from "apollo-server-express";

export const userTypeDefs = gql`
  extend type Query {
    me: User
    getUser(id: Int!): User
  }
  extend type Mutation {
    signupUser(
      username: String!
      name: String!
      surname: String!
      password: String!
      email: String!
      about: String
      active: Boolean
    ): Boolean!
    signinUser(password: String!, username: String!): Boolean!
  }
  type User {
    id: Int!
    username: String!
    gave: [Item]
    name: String!
    surname: String!
    email: String!
    password: String!
    about: String
    active: Boolean
  }
`;
