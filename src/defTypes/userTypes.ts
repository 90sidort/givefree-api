import { gql } from "apollo-server-express";

export const userTypeDefs = gql`
  extend type Query {
    getUser(id: Int!): User
    signinUser(password: String!, username: String!): AuthData!
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
    ): AuthData!
  }
  type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
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
