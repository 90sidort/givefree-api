import { getConnection } from "typeorm";

import { Item } from "../entity/Item";
import {
  ItemCreate,
  ItemSearch,
  ItemUpdate,
} from "../interfaces/itemInterfaces";
import { CategoryEnum, StatusEnum, StateEnum } from "../interfaces/enums";
import { Image } from "../entity/Image";
import { fileSaver } from "../utils/saveFile";

export const itemResolvers = {
  CategoryEnum,
  StatusEnum,
  StateEnum,
  Query: {
    getItem: async (_: any, args: { id: number }) => {
      const { id } = args;
      try {
        const item = await Item.findOne(id, { relations: ["images", "giver"] });
        if (!item) throw new Error("Item not found");
        return item;
      } catch (err) {
        throw new Error(`Server error!`);
      }
    },
    getItems: async (_: any, args: ItemSearch) => {
      // if (!context.isAuth) throw new Error("Unauthorized!");
      const { skip, first, name = "", description = "" } = args;
      try {
        const items = await Item.createQueryBuilder("item")
          .orderBy("item.updatedAt", "DESC")
          .skip(skip || undefined)
          .take(first || undefined)
          .leftJoinAndSelect("item.giver", "giver")
          .leftJoinAndSelect("item.images", "image")
          .orWhere("LOWER(item.name) like LOWER(:name)", {
            name: `%${name}%`,
          })
          .orWhere("LOWER(item.description) like LOWER(:description)", {
            description: `%${description}%`,
          })
          .getMany();
        if (!items) throw new Error("Items not found");
        return items;
      } catch (err) {
        throw new Error(`Server error!`);
      }
    },
    countItems: async (_: any) => {
      return await Item.count();
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
        if (updateItem.status === StatusEnum.GIVEN)
          throw new Error("Item alread given!");
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
