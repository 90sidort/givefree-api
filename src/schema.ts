import { makeExecutableSchema } from "graphql-tools";
import { merge } from "lodash";

import { userTypeDefs } from "./types/userTypes";
import { userResolvers } from "./resolvers/userResolver";

const Query = `
  type Query {
    _empty: String
  }
`;

const Mutation = `
  type Mutation {
    _empty: String
  }
`;

const resolvers = {};

export const schema = makeExecutableSchema({
  typeDefs: [Query, Mutation, userTypeDefs],
  resolvers: merge(resolvers, userResolvers),
});
