import { getConnection } from "typeorm";

import { Item } from "../entity/Item";
import { ItemCreate } from "../interfaces/itemInterfaces";
import { CategoryEnum, StatusEnum, StateEnum } from "../interfaces/enums";
import { Image } from "../entity/Image";
import { fileSaver } from "../utils/saveFile";

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
    addItem: async (
      _: any,
      args: { item: ItemCreate; file: any },
      context: any
    ) => {
      const { item, file } = args;
      if (!context.isAuth) throw new Error("Unauthorized!");
      const { name, active, status, state, category, description, giverId } =
        item;
      try {
        const item = Item.create({
          name,
          active,
          status,
          state,
          category,
          description,
          giverId,
        });
        if (file) {
          await getConnection().transaction(
            async (transactionalEntityManager) => {
              const imageUrl = await fileSaver(file);
              const savedItem = await transactionalEntityManager.save(item);
              const newImage = Image.create({
                url: imageUrl,
                item: savedItem,
              });
              await transactionalEntityManager.save(newImage);
            }
          );
        } else {
          await item.save();
        }
        return item;
      } catch (err) {
        throw new Error(`Server error!`);
      }
    },
  },
};
