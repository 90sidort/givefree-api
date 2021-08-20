import { Item } from "../entity/Item";
import { ItemCreate } from "../interfaces/itemInterfaces";
import { CategoryEnum, StatusEnum, StateEnum } from "../interfaces/enums";

export const itemResolvers = {
  CategoryEnum,
  StatusEnum,
  StateEnum,
  Query: {
    getItems: async (_: any, args: { id: number }, context: any) => {
      console.log(context);
      // if (!context.isAuth) throw new Error("Unauthorized!");
      const { id } = args;
      const query = id
        ? await Item.find({ where: { id }, relations: ["images", "giver"] })
        : await Item.find({ relations: ["images", "giver"] });
      return query;
    },
  },
  Mutation: {
    addItem: async (_: any, args: { item: ItemCreate }, context: any) => {
      const { item } = args;
      if (!context.isAuth) throw new Error("Unauthorized!");
      const { name, active, status, state, category, description } = item;
      try {
        const item = Item.create({
          name,
          active,
          status,
          state,
          category,
          description,
        });
        await item.save();
        return item;
      } catch (err) {
        throw new Error(`Server error!`);
      }
    },
  },
};
