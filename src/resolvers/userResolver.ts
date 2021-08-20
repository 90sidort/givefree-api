import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

import { User } from "../entity/User";
import { SignIn, SignUp } from "../interfaces/signInterfaces";

export const userResolvers = {
  Query: {
    getUser: async (_: any, args: { id: number }, context: any) => {
      if (!context.isAuth) throw new Error("Unauthorized!");
      const { id } = args;
      return await User.findOne({ relations: ["gave"], where: { id } });
    },
    signinUser: async (_: any, args: SignIn) => {
      try {
        const { username, password } = args;
        const user = await User.findOne({ where: { username } });
        if (!user) throw new Error(`User ${username} does not exist!`);
        const matches = await bcrypt.compare(password, user.password);
        if (!matches)
          throw new Error(`Password for user ${username} is incorrect!`);
        const token = jwt.sign(
          { userId: user.id, email: user.email },
          "super_secret_821378",
          {
            expiresIn: "12h",
          }
        );
        return { userId: user.id, token: token, tokenExpiration: 12 };
      } catch (err) {
        throw new Error(`Server error!`);
      }
    },
  },
  Mutation: {
    signupUser: async (_: any, args: SignUp) => {
      const { username, name, surname, email, password, about, active } = args;
      try {
        const userEmailExists = await User.findOne({ where: { email } });
        const userUsernameExists = await User.findOne({ where: { username } });
        if (userEmailExists || userUsernameExists)
          throw new Error(`User with username ${username} `);
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
          { userId: user.id, email: user.email },
          "super_secret_821378",
          {
            expiresIn: "12h",
          }
        );
        return { userId: user.id, token: token, tokenExpiration: 12 };
      } catch (error) {
        throw new Error(`Server error!`);
      }
    },
  },
};
