import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

import { User } from "../entity/User";
import { SignIn, SignUp } from "../interfaces/signInterfaces";

export const userResolvers = {
  Query: {
    me: async (_: any, __: any, context: any) => {
      const { req } = context;
      if (!req.userId) return null;
      return await User.findOne(req.userId);
    },
    getUser: async (_: any, args: { id: number }) => {
      // if (!context.isAuth) throw new Error("Unauthorized!");
      const { id } = args;
      return await User.findOne({ relations: ["gave"], where: { id } });
    },
  },
  Mutation: {
    signinUser: async (_: any, args: SignIn, context: any) => {
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
          "super_secret_821378",
          {
            expiresIn: "12h",
          }
        );
        res.cookie("token", token);
        return true;
      } catch (err) {
        throw new Error(err ? err : "Server error!");
      }
    },
    signout: async (_: any, __: any, context: any) => {
      const { res } = context;
      try {
        res.cookie("token", "deleted");
      } catch (err) {
        throw new Error(err ? err : "Server error!");
      }
      return true;
    },
    signupUser: async (_: any, args: SignUp, context: any) => {
      const { res } = context;
      const { username, name, surname, email, password, about, active } = args;
      try {
        const userEmailExists = await User.findOne({ where: { email } });
        const userUsernameExists = await User.findOne({ where: { username } });
        if (userEmailExists || userUsernameExists)
          throw new Error(`User ${username} already exists!`);
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
          "super_secret_821378",
          {
            expiresIn: "12h",
          }
        );
        res.cookie("token", token);
        return true;
      } catch (error) {
        throw new Error(`Server error!`);
      }
    },
  },
};
