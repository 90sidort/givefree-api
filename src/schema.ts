import { makeExecutableSchema } from "graphql-tools";
import { merge } from "lodash";
import { itemTypeDefs } from "./defTypes/itemTypes";

import { userTypeDefs } from "./defTypes/userTypes";
import { itemResolvers } from "./resolvers/itemResolver";
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
  typeDefs: [Query, Mutation, userTypeDefs, itemTypeDefs],
  resolvers: merge(resolvers, userResolvers, itemResolvers),
});
