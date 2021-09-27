import validator from "validator";
import { ItemCreate } from "../interfaces/itemInterfaces";

const giverIdError = `Giver id has to a number!`;
const nameItemError = `Item name has to a number!`;

export const validateUserCreate = (input: ItemCreate) => {
  const { giverId, name, category, description, active, status, state } = input;
  if (typeof giverId !== "number") throw new Error(giverIdError);
  if (!validator.isLength(name, { min: 4, max: 400 }))
    throw new Error("giverId has to a number!");
};
