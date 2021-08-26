import { makeExecutableSchema } from "graphql-tools";
import { merge } from "lodash";
import { itemTypeDefs } from "./defTypes/itemTypes";
import { uploadTypeDefs } from "./defTypes/imageTypes";

import { userTypeDefs } from "./defTypes/userTypes";
import { itemResolvers } from "./resolvers/itemResolver";
import { uploadResolvers } from "./resolvers/imageResolver";
import { userResolvers } from "./resolvers/userResolver";
import { wishlistTypeDefs } from "./defTypes/wishlistTypes";
import { wishlistResolvers } from "./resolvers/wishlistResolver";

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
  typeDefs: [
    Query,
    Mutation,
    userTypeDefs,
    itemTypeDefs,
    uploadTypeDefs,
    wishlistTypeDefs,
  ],
  resolvers: merge(
    resolvers,
    userResolvers,
    itemResolvers,
    uploadResolvers,
    wishlistResolvers
  ),
});
