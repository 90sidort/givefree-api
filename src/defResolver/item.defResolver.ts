import { getConnection } from "typeorm";

import { Item } from "../entity/Item";
import { ItemSearch } from "../interfaces/itemInterfaces";
import { ItemCreate, ItemUpdate } from "../interfaces/itemInterfaces";
import { StatusEnum } from "../interfaces/enums";
import { Image } from "../entity/Image";
import { fileSaver } from "../utils/saveFile";

export const getItemQuery = async (_: any, args: { id: number }) => {
  const { id } = args;
  try {
    const item = await Item.findOne(id, { relations: ["images", "giver"] });
    if (!item) throw new Error("Item not found");
    return item;
  } catch (err) {
    throw new Error(err ? err : "Server error!");
  }
};

export const getItemsQuery = async (_: any, args: ItemSearch) => {
  // if (!context.isAuth) throw new Error("Unauthorized!");
  const {
    input: { skip, first, name, status, userId, taken },
  } = args;
  try {
    const base = Item.createQueryBuilder("item")
      .orderBy("item.updatedAt", "DESC")
      .skip(skip || undefined)
      .take(first || undefined)
      .leftJoinAndSelect("item.giver", "giver")
      .leftJoinAndSelect("item.images", "image");
    if (status)
      base.andWhere("item.status = :status", {
        status: status.toLowerCase(),
      });
    if (name)
      base.andWhere("LOWER(item.name) like LOWER(:name)", {
        name: `%${name}%`,
      });
    if (userId && taken === true)
      base.andWhere("item.takerId = :takerId", { takerId: userId });
    if (userId && taken === false)
      base.andWhere("item.giverId = :giverId", { giverId: userId });
    const items = await base.getMany();
    return items;
  } catch (err) {
    throw new Error(err ? err : "Server error!");
  }
};

export const countItemsQuery = async (
  _: any,
  args: { status: StatusEnum; takerId?: number }
) => {
  const { status, takerId } = args;
  try {
    if (status === StatusEnum.ONGOING)
      return await Item.count({ where: { status } });
    else if (status === StatusEnum.GIVEN)
      return await Item.count({ where: { status, takerId } });
    return await Item.count();
  } catch (err) {
    throw new Error(err ? err : "Server error!");
  }
};

export const updateItemQuery = async (
  _: any,
  args: { id: number; item: ItemUpdate }
) => {
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
};

export const deleteItemQuery = async (_: any, args: { id: number }) => {
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
};

export const addItemsMutation = async (
  _: any,
  args: { item: ItemCreate; file: any }
) => {
  const { item, file } = args;
  // if (!context.isAuth) throw new Error("Unauthorized!");
  const { name, active, status, state, category, description, giverId } = item;
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
      await getConnection().transaction(async (transactionalEntityManager) => {
        const imageUrl = await fileSaver(file);
        const savedItem = await transactionalEntityManager.save(item);
        const newImage = Image.create({
          url: imageUrl,
          item: savedItem,
        });
        await transactionalEntityManager.save(newImage);
      });
    } else {
      await item.save();
    }
    return item;
  } catch (err) {
    throw new Error(err ? err : "Server error!");
  }
};
