import { gql } from "apollo-server-express";

export const itemTypeDefs = gql`
  extend type Query {
    getItems(input: ItemSearchInput!): [Item]!
    getTaken(input: ItemSearchInput!): [Item]!
    getGiven(input: ItemSearchInput!): [Item]!
    getGiving(input: ItemSearchInput!): [Item]!
    countItems(input: ItemCountInput!): Int!
    getItem(id: Int!): Item!
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
    wishers: [User]
    images: [File]
    taker: User
  }
  input ItemSearchInput {
    skip: Int
    first: Int
    name: String
    userId: Int
    view: String
    category: CategoryEnum
  }
  input ItemCountInput {
    takerId: Int
    view: String
    category: CategoryEnum
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
    ALL
  }
`;
