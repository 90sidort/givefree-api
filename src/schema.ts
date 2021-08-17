import { makeExecutableSchema } from "graphql-tools";
import { merge } from "lodash";
import { itemTypeDefs } from "./defTypes/itemTypes";
import { uploadTypeDefs } from "./defTypes/uploadTypes";

import { userTypeDefs } from "./defTypes/userTypes";
import { itemResolvers } from "./resolvers/itemResolver";
import { uploadResolvers } from "./resolvers/uploadResolver";
import { userResolvers } from "./resolvers/userResolver";

const Query = `
  scalar FileUpload
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
  typeDefs: [Query, Mutation, userTypeDefs, itemTypeDefs, uploadTypeDefs],
  resolvers: merge(resolvers, userResolvers, itemResolvers, uploadResolvers),
});
