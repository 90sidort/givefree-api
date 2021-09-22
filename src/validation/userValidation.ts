import validator from "validator";
import { SignUp } from "../interfaces/signInterfaces";

export const validateUserCreate = (input: SignUp) => {
  const { username, name, surname, email, password, about, retype } = input;
  if (!validator.isLength(username, { min: 4, max: 200 }))
    throw new Error("Username has to be bewteen 4 and 200 characters long!");
  if (!validator.isLength(name, { min: 2, max: 200 }))
    throw new Error("Name has to be bewteen 2 and 200 characters long!");
  if (!validator.isLength(surname, { min: 2, max: 200 }))
    throw new Error("Surname has to be bewteen 2 and 200 characters long!");
  if (!validator.isEmail(email)) throw new Error("Email has to be correct!");
  if (!validator.isLength(password, { min: 6, max: 200 }))
    throw new Error("Password has to be bewteen 6 and 200 characters long!");
  if (password !== retype) throw new Error("Passwords have to match!");
  if (about) {
    if (!validator.isLength(about, { min: 0, max: 2000 }))
      throw new Error("About cannot be longer than 2000 characters!");
  }
};
