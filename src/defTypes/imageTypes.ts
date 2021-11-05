import { gql } from "apollo-server-express";

export const uploadTypeDefs = gql`
  extend type Query {
    test: String!
  }
  extend type Mutation {
    uploadFile(file: FileUpload!, image: AddImage!): File!
  }
  type File {
    url: String!
    alt: String!
    itemId: Int!
  }
  input AddImage {
    alt: String
    itemId: Int!
  }
`;
