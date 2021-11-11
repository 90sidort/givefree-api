import validator from "validator";
import { ItemCreate, ItemUpdate } from "../interfaces/itemInterfaces";

const categoryEnums = [
  "other",
  "tshir",
  "sweatshirt",
  "trousers",
  "hoodie",
  "dress",
  "polo",
  "jacket",
  "coat",
  "jeans",
  "socks",
  "shorts",
];
const stateEnums = ["new", "good", "decent", "broken"];
const statusEnums = ["draft", "given", "ongoing"];

const giverIdError = `Giver id has to a number!`;
const nameItemError = (name: string) =>
  `Item name: ${name} is not between 4 and 400 characters long!`;
const categoryItemError = (category: string) =>
  `Category ${category} is invalid!`;
const statusItemError = (status: string) => `Status ${status} is invalid!`;
const stateItemError = (state: string) => `State ${state} is invalid!`;
const descriptionError = `Description has to be between 5 and 2000 characters!`;
const activeError = `Active has to be either true or false!`;

export const validateItemCreate = (input: ItemCreate) => {
  const { giverId, name, category, status, state, description, active } = input;
  if (typeof giverId !== "number") throw new Error(giverIdError);
  if (!validator.isLength(name, { min: 4, max: 400 }))
    throw new Error(nameItemError(name));
  if (!categoryEnums.includes(category))
    throw new Error(categoryItemError(category));
  if (!stateEnums.includes(state)) throw new Error(stateItemError(state));
  if (!statusEnums.includes(status)) throw new Error(statusItemError(status));
  if (active !== undefined) {
    if (typeof active !== "boolean") throw new Error(activeError);
  }
  if (description) {
    if (!validator.isLength(description, { min: 5, max: 2000 }))
      throw new Error(descriptionError);
  }
};

export const validateItemUpdate = (input: ItemUpdate) => {
  const { name, category, status, state, description, active } = input;
  if (name) {
    if (!validator.isLength(name, { min: 4, max: 400 }))
      throw new Error(nameItemError(name));
  }
  if (category) {
    if (!categoryEnums.includes(category))
      throw new Error(categoryItemError(category));
  }
  if (status) {
    if (!statusEnums.includes(status)) throw new Error(statusItemError(status));
  }
  if (state) {
    if (!stateEnums.includes(state)) throw new Error(stateItemError(state));
  }
  if (active !== undefined) {
    if (typeof active !== "boolean") throw new Error(activeError);
  }
  if (description) {
    if (!validator.isLength(description, { min: 5, max: 2000 }))
      throw new Error(descriptionError);
  }
};
