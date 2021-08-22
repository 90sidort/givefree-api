import { getConnection } from "typeorm";

import { Item } from "../entity/Item";
import { ItemCreate, ItemUpdate } from "../interfaces/itemInterfaces";
import { CategoryEnum, StatusEnum, StateEnum } from "../interfaces/enums";
import { Image } from "../entity/Image";
import { fileSaver } from "../utils/saveFile";

export const itemResolvers = {
  CategoryEnum,
  StatusEnum,
  StateEnum,
  Query: {
    getItems: async (_: any, args: { id: number }) => {
      // if (!context.isAuth) throw new Error("Unauthorized!");
      const { id } = args;
      const query = id
        ? await Item.find({ where: { id }, relations: ["images", "giver"] })
        : await Item.find({ relations: ["images", "giver"] });
      return query;
    },
  },
  Mutation: {
    addItem: async (_: any, args: { item: ItemCreate; file: any }) => {
      const { item, file } = args;
      // if (!context.isAuth) throw new Error("Unauthorized!");
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
    updateItem: async (_: any, args: { id: number; item: ItemUpdate }) => {
      const { id, item } = args;
      const { name, active, status, state, category, description } = item;
      try {
        const updateItem = await Item.findOne(id);
        if (!updateItem) throw new Error("Item does not exist!");
        if (name) updateItem.name = name;
        if (active) updateItem.active = active;
        if (status) updateItem.status = status;
        if (state) updateItem.state = state;
        if (category) updateItem.category = category;
        if (description) updateItem.description = description;
        await updateItem.save();
        return updateItem;
      } catch (err) {
        throw new Error(`Server error!`);
      }
    },
    deleteItem: async (_: any, args: { id: number }) => {
      const { id } = args;
      try {
        const deleteItem = await Item.findOne(id);
        if (!deleteItem) throw new Error("Item does not exist!");
        if (deleteItem.status === "given")
          throw new Error("Cannot delete archived item!");
        const returnItem = { ...deleteItem };
        await deleteItem.remove();
        return returnItem;
      } catch (err) {
        throw new Error(`Server error!`);
      }
    },
  },
};
