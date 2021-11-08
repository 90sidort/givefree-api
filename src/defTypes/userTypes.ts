import { gql } from "apollo-server-express";

export const userTypeDefs = gql`
  extend type Query {
    me: User
    getUser(id: Int!): User
  }
  extend type Mutation {
    updateUser(
      id: Int!
      name: String
      surname: String
      newEmail: String
      about: String
      active: Boolean
    ): User!
    signupUser(
      username: String!
      name: String!
      surname: String!
      password: String!
      email: String!
      about: String
      active: Boolean
      retype: String!
    ): String!
    signinUser(password: String!, username: String!): String!
    signout: Boolean!
    requestReset(email: String!): Boolean!
    resetPassword(
      email: String!
      token: String!
      password: String!
      retype: String!
    ): Boolean!
  }
  type User {
    id: Int!
    username: String!
    gave: [Item]
    taken: [Item]
    name: String!
    surname: String!
    email: String!
    password: String!
    about: String
    active: Boolean
  }
`;
