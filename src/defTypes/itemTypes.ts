import { gql } from "apollo-server-express";

export const itemTypeDefs = gql`
  extend type Query {
    getItems(id: Int, skip: Int, first: Int): [Item]
    countItems: Int!
  }
  extend type Mutation {
    addItem(item: ItemInput!, file: FileUpload): Item!
    updateItem(id: Int!, item: ItemInputUpdate!): Item!
    deleteItem(id: Int!): Item!
  }
  type Item {
    id: Int!
    name: String!
    active: Boolean!
    status: StatusEnum!
    state: StateEnum!
    category: CategoryEnum!
    giver: User!
    giverId: Int!
    description: String
    images: [File]
  }
  input ItemInput {
    name: String!
    giverId: Int!
    active: Boolean
    status: StatusEnum
    state: StateEnum
    category: CategoryEnum!
    description: String
  }
  input ItemInputUpdate {
    name: String
    active: Boolean
    status: StatusEnum
    state: StateEnum
    category: CategoryEnum
    description: String
  }
  enum StatusEnum {
    DRAFT
    GIVEN
    ONGOING
  }
  enum StateEnum {
    NEW
    GOOD
    DECENT
    BROKEN
  }
  enum CategoryEnum {
    OTHER
    TSHIRT
    SWEATSHIRT
    TROUSERS
    HOODIE
    DRESS
    POLO
    JACKET
    COAT
    JEANS
    SOCKS
    SHORTS
  }
`;
