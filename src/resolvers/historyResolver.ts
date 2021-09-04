import { Item } from "../entity/Item";
import { User } from "../entity/User";
import { TakenItems } from "../interfaces/itemInterfaces";

export const historyResolvers = {
  Query: {
    getTaken: async (_: any, args: TakenItems) => {
      const { userId, skip, first } = args;
      try {
        return await Item.find({
          where: { takerId: userId },
          relations: ["images", "giver"],
          skip: skip,
          take: first,
        });
      } catch (err) {
        throw new Error(err ? err : "Server error!");
      }
    },
    getGiven: async (_: any, args: { userId: number }) => {
      const { userId } = args;
      try {
        const userGave = await User.findOne(userId, {
          relations: ["gave", "gave.images", "gave.giver"],
        });
        if (!userGave) throw new Error("User not found!");
        return userGave?.gave;
      } catch (err) {
        throw new Error(err ? err : "Server error!");
      }
    },
  },
  Mutation: {},
};
