import { getConnection } from "typeorm";

import { Item } from "../entity/Item";
import { User } from "../entity/User";
import { StatusEnum } from "../interfaces/enums";

export const wishlistResolvers = {
  Query: {
    getWishlist: async (_: any, args: { userId: number }) => {
      const { userId } = args;
      try {
        const wishlist = await User.findOne(userId, {
          relations: ["wishes", "wishes.images"],
        });
        if (!wishlist) throw new Error("User not found!");
        return wishlist.wishes;
      } catch (err) {
        throw new Error(err ? err : "Server error!");
      }
    },
    getWishers: async (_: any, args: { itemId: number }) => {
      const { itemId } = args;
      try {
        const wishers = await Item.findOne(itemId, { relations: ["wishers"] });
        if (!wishers) throw new Error("User not found!");
        return wishers.wishers;
      } catch (err) {
        throw new Error(err ? err : "Server error!");
      }
    },
  },
  Mutation: {
    addToWishlist: async (_: any, args: { userId: number; itemId: number }) => {
      try {
        const { userId, itemId } = args;
        const item = await Item.findOne(itemId, { relations: ["wishers"] });
        if (!item) throw new Error("Item not found!");
        if (item.status !== "ongoing") throw new Error("Item not for grabs!");
        const user = await User.findOne(userId, { relations: ["wishes"] });
        if (!user) throw new Error("User not found!");
        if (item.giverId === user.id)
          throw new Error("Cannot give item to yourself!");
        if (user.wishes.length >= 10)
          throw new Error("Can not have more than 10 items on wishlist!");
        item.wishers.forEach((u) => {
          if (u.id === user.id)
            throw new Error("User already added this item to wishlist");
        });
        item.wishers.push(user);
        await item.save();
        return true;
      } catch (err) {
        throw new Error(err ? err : "Server error!");
      }
    },
    removeFromWishlist: async (
      _: any,
      args: { userId: number; itemId: number }
    ) => {
      try {
        const { userId, itemId } = args;
        const item = await Item.findOne(itemId, { relations: ["wishers"] });
        if (!item) throw new Error("Item not found!");
        const user = await User.findOne(userId);
        if (!user) throw new Error("User not found!");
        item.wishers = item.wishers.filter((u) => u.id !== user.id);
        await item.save();
        return true;
      } catch (err) {
        throw new Error(err ? err : "Server error!");
      }
    },
    giveItem: async (_: any, args: { userId: number; itemId: number }) => {
      try {
        const { userId, itemId } = args;
        const item = await Item.findOne(itemId, { relations: ["wishers"] });
        if (!item) throw new Error("Item not found!");
        if (item.status !== StatusEnum.ONGOING)
          throw new Error("Cannot give draft or already given item!");
        const user = await User.findOne(userId, { relations: ["taken"] });
        if (!user) throw new Error("User not found!");
        if (item.giverId === user.id)
          throw new Error("Cannot give item to yourself!");
        item.wishers = [];
        item.status = StatusEnum.GIVEN;
        user.taken.push(item);
        await getConnection().transaction(
          async (transactionalEntityManager) => {
            await transactionalEntityManager.save(item);
            await transactionalEntityManager.save(user);
          }
        );
        return true;
      } catch (err) {
        throw new Error(err ? err : "Server error!");
      }
    },
  },
};
