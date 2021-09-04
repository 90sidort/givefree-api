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
        throw new Error(err ? err : "Server error!");
      }
    },
    getItems: async (_: any, args: ItemSearch) => {
      // if (!context.isAuth) throw new Error("Unauthorized!");
      const { skip, first, name, status } = args;
      try {
        const base = Item.createQueryBuilder("item")
          .orderBy("item.updatedAt", "DESC")
          .skip(skip || undefined)
          .take(first || undefined)
          .leftJoinAndSelect("item.giver", "giver")
          .leftJoinAndSelect("item.images", "image");
        if (status) {
          base.andWhere("item.status = :status", {
            status: status.toLowerCase(),
          });
        }
        if (name) {
          base.andWhere("LOWER(item.name) like LOWER(:name)", {
            name: `%${name}%`,
          });
        }
        const items = await base.getMany();
        return items;
      } catch (err) {
        throw new Error(err ? err : "Server error!");
      }
    },
    countItems: async (_: any, args: { status: StatusEnum }) => {
      const { status } = args;
      if (status) return await Item.count({ where: { status } });
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
        if (!name || !giverId) throw new Error("Provide missing data!");
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
        throw new Error(err ? err : "Server error!");
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
        throw new Error(err ? err : "Server error!");
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
        throw new Error(err ? err : "Server error!");
      }
    },
  },
};
