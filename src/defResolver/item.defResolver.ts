import { getConnection } from "typeorm";

import { Item } from "../entity/Item";
import { ItemCount, ItemSearch } from "../interfaces/itemInterfaces";
import { ItemCreate, ItemUpdate } from "../interfaces/itemInterfaces";
import { StatusEnum, CategoryEnum } from "../interfaces/enums";
import { Image } from "../entity/Image";
import { fileSaver } from "../utils/saveFile";
import {
  validateItemCreate,
  validateItemUpdate,
} from "../validation/itemValidation";

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
  const {
    input: { skip, first, name, userId, view, category = CategoryEnum.ALL },
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
    if (category !== CategoryEnum.ALL) {
      base.andWhere("item.category = :category", {
        category: category,
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
    input: { takerId, view, category = CategoryEnum.ALL },
  } = args;
  try {
    const base = Item.createQueryBuilder("item").select("COUNT(item)", "count");
    if (view === "items")
      base.where("item.status = :status", { status: StatusEnum.ONGOING });
    else if (view === "taken")
      base
        .where("item.status = :status", { status: StatusEnum.GIVEN })
        .andWhere("item.takerId = :takerId", { takerId });
    else if (view === "given")
      base
        .where("item.status = :status", { status: StatusEnum.GIVEN })
        .andWhere("item.giverId = :giverId", { giverId: takerId });
    else if (view === "giving")
      base
        .where("item.status != :status", {
          status: StatusEnum.GIVEN,
        })
        .andWhere("item.giverId = :giverId", { giverId: takerId });
    if (category !== CategoryEnum.ALL)
      base.andWhere("item.category = :category", { category });
    const res = await base.getRawOne();
    return res.count;
  } catch (err) {
    throw new Error(err ? err : "Server error!");
  }
};

export const addItemsMutation = async (
  _: any,
  args: { item: ItemCreate; file: any },
  context: any
) => {
  try {
    const { req } = context;
    if (!req.isAuth) throw new Error("Unauthorized!");
    const { item, file } = args;
    validateItemCreate(item);
    const { name, active, status, state, category, description } = item;
    const itemNew = Item.create({
      name,
      active,
      status,
      state,
      category,
      description,
      giverId: req.userId,
    });
    if (file) {
      await getConnection().transaction(async (transactionalEntityManager) => {
        const imageUrl = await fileSaver(file);
        const savedItem = await transactionalEntityManager.save(itemNew);
        const newImage = Image.create({
          url: imageUrl,
          item: savedItem,
        });
        await transactionalEntityManager.save(newImage);
      });
    } else {
      await itemNew.save();
    }
    return itemNew;
  } catch (err) {
    throw new Error(err ? err : "Server error!");
  }
};

export const updateItemQuery = async (
  _: any,
  args: { id: number; item: ItemUpdate },
  context: any
) => {
  try {
    const { req } = context;
    if (!req.isAuth) throw new Error("Unauthorized!");
    const { id, item } = args;
    validateItemUpdate(item);
    const { name, active, status, state, category, description } = item;
    const updateItem = await Item.findOne(id);
    if (!updateItem) throw new Error("Item does not exist!");
    if (req.userId !== updateItem.giverId)
      throw new Error("Cannot change other user item!");
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

export const deleteItemQuery = async (
  _: any,
  args: { id: number },
  context: any
) => {
  try {
    const { req } = context;
    if (!req.isAuth) throw new Error("Unauthorized!");
    const { id } = args;
    const deleteItem = await Item.findOne(id);
    if (!deleteItem) throw new Error("Item does not exist!");
    if (req.userId !== deleteItem.giverId)
      throw new Error("Cannot delete other user item!");
    if (deleteItem.status === "given")
      throw new Error("Cannot delete archived item!");
    const returnItem = { ...deleteItem };
    await deleteItem.remove();
    return returnItem;
  } catch (err) {
    throw new Error(err ? err : "Server error!");
  }
};
