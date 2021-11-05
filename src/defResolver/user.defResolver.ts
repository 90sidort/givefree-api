import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

import { User } from "../entity/User";
import { SignIn, SignUp, UpdateUser } from "../interfaces/signInterfaces";
import { sendResetEmail } from "../utils/mail";
import { validateUserCreate, validateResetPassword, validateUserUpdate } from "../validation/userValidation";

export const meQuery = async (_: any, __: any, context: any) => {
  const { req } = context;
  if (!req.userId) return null;
  return await User.findOne(req.userId);
};

export const getUserQuery = async (_: any, args: { id: number }) => {
  // if (!context.isAuth) throw new Error("Unauthorized!");
  const { id } = args;
  return await User.findOne({
    relations: ["gave", "taken"],
    where: { id },
  });
};

export const requestResetMutation = async (_: any, args: { email: string }) => {
  const { email } = args;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error(`User with email: ${email} does not exist!`);
    user.reset = true;
    await user.save();
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.SECRET as string,
      {
        expiresIn: 60 * 5,
      }
    );
    await sendResetEmail(token, email);
    return true;
  } catch (err) {
    throw new Error(err ? err : "Server error!");
  }
};

export const resetPasswordMutation = async (
  _: any,
  args: { email: string; token: string; password: string; retype: string }
) => {
  try {
    const { email, token, password, retype } = args;
    validateResetPassword(password, retype)
    const match = jwt.verify(token, process.env.SECRET as string);
    if (!match) throw new Error(`Invalid token`);
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error(`User with email: ${email} does not exist!`);
    if (!user.reset)
      throw new Error(
        `User with email: ${email} did not request password reset!`
      );
    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    user.reset = false;
    user.save();
    return true;
  } catch (err) {
    throw new Error(err ? err : "Server error!");
  }
};

export const signinUserMutation = async (
  _: any,
  args: SignIn,
  context: any
) => {
  const { res } = context;
  try {
    const { username, password } = args;
    const user = await User.findOne({ where: { username } });
    if (!user) throw new Error(`User ${username} does not exist!`);
    const matches = await bcrypt.compare(password, user.password);
    if (!matches)
      throw new Error(`Password for user ${username} is incorrect!`);
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.SECRET as string,
      {
        expiresIn: "12h",
      }
    );
    res.cookie("token", token);
    return true;
  } catch (err) {
    throw new Error(err ? err : "Server error!");
  }
};

export const signoutMutation = async (_: any, __: any, context: any) => {
  const { res } = context;
  try {
    res.cookie("token", "deleted");
  } catch (err) {
    throw new Error(err ? err : "Server error!");
  }
  return true;
};

export const updateUserMutation = async (_: any, args: UpdateUser) => {
  try {
    validateUserUpdate(args)
    const { id, name, surname, newEmail, active, about } = args;
    const user = await User.findOne(id);
    if (!user) throw new Error("User not found!");
    if (name) user.name = name;
    if (surname) user.surname = surname;
    if (newEmail) {
      const emailCheck = await User.findOne({ email: newEmail });
      if (emailCheck) throw new Error(`Email ${newEmail} already taken!`);
      user.email = newEmail;
    }
    if (active) user.active = active;
    if (about) user.about = about;
    await user.save();
    return user;
  } catch (err) {
    throw new Error(err ? err : "Server error!");
  }
};

export const signupUserMutation = async (
  _: any,
  args: SignUp,
  context: any
) => {
  try {
    const { res } = context;
    validateUserCreate(args);
    const { username, name, surname, email, password, about, active } =
      args;
    const userEmailExists = await User.findOne({ where: { email } });
    const userUsernameExists = await User.findOne({ where: { username } });
    if (userUsernameExists) throw new Error(`User ${username} already exists!`);
    if (userEmailExists)
      throw new Error(`User with email ${email} already exists!`);
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = User.create({
      username,
      name,
      password: hashedPassword,
      surname,
      email,
      about,
      active,
    });
    await user.save();
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.SECRET as string,
      {
        expiresIn: "12h",
      }
    );
    res.cookie("token", token);
    return true;
  } catch (err) {
    throw new Error(err ? err : "Server error!");
  }
};
