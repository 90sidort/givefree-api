import validator from "validator";
import { SignUp, UpdateUser } from "../interfaces/signInterfaces";

const matchError = `Passwords have to match!"`
const passwordError = `Password has to be bewteen 6 and 200 characters long!"`
const nameError = `Name has to be bewteen 2 and 200 characters long!`;
const surnameError = `Surname has to be bewteen 2 and 200 characters long!`;
const emailError = `Email has to be correct!`
const aboutError = `About cannot be longer than 2000 characters!`
const activeError = `Active has to be either true or false!`

export const validateUserCreate = (input: SignUp) => {
  const { username, name, surname, email, password, about, retype } = input;
  if (!validator.isLength(username, { min: 4, max: 200 }))
    throw new Error("Username has to be bewteen 4 and 200 characters long!");
  if (!validator.isLength(name, { min: 2, max: 200 }))
    throw new Error(nameError);
  if (!validator.isLength(surname, { min: 2, max: 200 }))
    throw new Error(surnameError);
  if (!validator.isEmail(email)) throw new Error(emailError);
  if (!validator.isLength(password, { min: 6, max: 200 }))
    throw new Error(passwordError);
  if (password !== retype) throw new Error(matchError);
  if (about) {
    if (!validator.isLength(about, { min: 0, max: 2000 }))
      throw new Error(aboutError);
  }
};

export const validateResetPassword = (password: string, retype: string) => {
  if (password !== retype) throw new Error(matchError)
  if (!validator.isLength(password, { min: 6, max: 200 })) throw new Error(passwordError);
}

export const validateUserUpdate = (input: UpdateUser) => {
    const { name, surname, newEmail, about, active } = input;

    if(name) {
      if (!validator.isLength(name, { min: 2, max: 200 }))
        throw new Error(nameError);
    }
    if(surname) {
      if (!validator.isLength(surname, { min: 2, max: 200 }))
        throw new Error(surnameError);
    }
    if(newEmail) {
      if (!validator.isEmail(newEmail)) throw new Error(emailError);
    }
    if(active !== undefined) {
      if (typeof active !== 'boolean') throw new Error(activeError);
    }
    if (about) {
      if (!validator.isLength(about, { min: 0, max: 2000 }))
        throw new Error(aboutError);
    }
}
