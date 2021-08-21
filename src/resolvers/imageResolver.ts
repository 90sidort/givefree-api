import { Image } from "../entity/Image";
import { AddImage } from "../interfaces/uploadInterfaces";
import { Item } from "../entity/Item";
import { fileSaver } from "../utils/saveFile";

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
        const imageUrl = await fileSaver(file);
        const { alt, itemId } = image;
        const item = await Item.findOne(itemId);
        if (!item)
          throw new Error("Cannot add picture to item that does not exist!");
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
