import { User } from "./entity/User";

export const resolvers = {
  Query: {
    getUser: async (_: any, args: any) => {
      const { id } = args;
      return await User.findOne({ where: { id: id } });
    }
  },
  Mutation: {
    addUser: async (_: any, args: any) => {
      const { username, name, surname, email, about, active } = args;
      try {
        const user = User.create({
          username, name, surname, email, about, active
        });
        await user.save();
        return true;
      } catch (error) {
        return false;
      }
    }
  }
};
