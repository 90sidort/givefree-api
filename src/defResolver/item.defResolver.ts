import { getConnection } from "typeorm";

import { Item } from "../entity/Item";
import { ItemCount, ItemSearch } from "../interfaces/itemInterfaces";
import { ItemCreate, ItemUpdate } from "../interfaces/itemInterfaces";
import { StatusEnum } from "../interfaces/enums";
import { Image } from "../entity/Image";
import { fileSaver } from "../utils/saveFile";

export const getItemQuery = async (_: any, args: { id: number }) => {
  const { id } = args;
  try {
    const item = await Item.findOne(id, {
      relations: ["images", "giver", "wishers", "taker"],
    });
    if (!item) throw new Error("Item not found");
    return item;
  } catch (err) {
    throw new Error(err ? err : "Server error!");
  }
};

export const getItemsQuery = async (_: any, args: ItemSearch) => {
  // if (!context.isAuth) throw new Error("Unauthorized!");
  const {
    input: { skip, first, name, userId, view },
  } = args;
  try {
    const base = Item.createQueryBuilder("item")
      .orderBy("item.updatedAt", "DESC")
      .skip(skip || undefined)
      .take(first || undefined)
      .leftJoinAndSelect("item.giver", "giver")
      .leftJoinAndSelect("item.images", "image");
    if (view === "items")
      base.andWhere("item.status = :status", {
        status: StatusEnum.ONGOING,
      });
    if (name) {
      base.andWhere("LOWER(item.name) like LOWER(:name)", {
        name: `%${name}%`,
      });
      base.andWhere("item.status = :status", {
        status: StatusEnum.ONGOING,
      });
    }
    if (view === "giving") {
      base.andWhere("item.giverId = :giverId", { giverId: userId });
      base.andWhere("item.status != :status", {
        status: StatusEnum.GIVEN,
      });
    }
    if (view === "taken") {
      base.andWhere("item.status = :status", {
        status: StatusEnum.GIVEN,
      });
      base.andWhere("item.takerId = :takerId", { takerId: userId });
    }
    if (view === "given") {
      base.andWhere("item.giverId = :giverId", { giverId: userId });
      base.andWhere("item.status = :status", {
        status: StatusEnum.GIVEN,
      });
    }
    const items = await base.getMany();
    return items;
  } catch (err) {
    throw new Error(err ? err : "Server error!");
  }
};

export const countItemsQuery = async (_: any, args: ItemCount) => {
  const {
    input: { takerId, view },
  } = args;
  try {
    if (view === "items")
      return await Item.count({ where: { status: StatusEnum.ONGOING } });
    else if (view === "taken")
      return await Item.count({ where: { status: StatusEnum.GIVEN, takerId } });
    else if (view === "given")
      return await Item.count({
        where: { status: StatusEnum.GIVEN, giverId: takerId },
      });
    else if (view === "giving") {
      const drafts = await Item.count({
        where: { status: StatusEnum.DRAFT, giverId: takerId },
      });
      const ongoing = await Item.count({
        where: { status: StatusEnum.ONGOING, giverId: takerId },
      });
      return drafts + ongoing;
    }
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
