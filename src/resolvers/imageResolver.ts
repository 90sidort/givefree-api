import * as path from "path";
import * as fs from "fs";

import { Image } from "../entity/Image";
import { AddImage } from "../interfaces/uploadInterfaces";
import { Item } from "../entity/Item";

export const uploadResolvers = {
  Query: {
    test: () => "Works!",
  },
  Mutation: {
    uploadFile: async (
      _: any,
      { file, image }: { file: any; image: AddImage }
    ) => {
      try {
        const { createReadStream, filename } = await file;
        const { alt, itemId } = image;
        const item = await Item.findOne(itemId);
        if (!item)
          throw new Error("Cannot add picture to item that does not exist!");
        const stream = createReadStream();
        const pathName = path.join(__dirname, `../../images/${filename}`);
        await stream.pipe(fs.createWriteStream(pathName));
        const imageUrl = `http://localhost:4000/${filename}`;
        const newImage = Image.create({
          url: imageUrl,
          alt,
          item,
        });
        await newImage.save();
        return newImage;
      } catch (err) {
        throw new Error(`Server error!`);
      }
    },
  },
};
