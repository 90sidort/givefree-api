import {
  addItemsMutation,
  countItemsQuery,
  deleteItemQuery,
  getItemQuery,
  getItemsQuery,
  updateItemQuery,
} from "../defResolver/item.defResolver";

import { CategoryEnum, StatusEnum, StateEnum } from "../interfaces/enums";

export const itemResolvers = {
  CategoryEnum,
  StatusEnum,
  StateEnum,
  Query: {
    getItem: getItemQuery,
    getItems: getItemsQuery,
    getTaken: getItemsQuery,
    getGiven: getItemsQuery,
    getGiving: getItemsQuery,
    countItems: countItemsQuery,
  },
  Mutation: {
    addItem: addItemsMutation,
    updateItem: updateItemQuery,
    deleteItem: deleteItemQuery,
  },
};
