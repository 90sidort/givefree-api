import { gql } from "apollo-server-express";

export const uploadTypeDefs = gql`
  extend type Query {
    test: String!
  }
  extend type Mutation {
    uploadFile(file: FileUpload!): File!
  }
  type File {
    url: String!
  }
`;
