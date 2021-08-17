import * as path from "path";
import * as fs from "fs";

export const uploadResolvers = {
  Query: {
    test: () => "Works!",
  },
  Mutation: {
    uploadFile: async (_: any, { file }: { file: any }) => {
      const { createReadStream, filename } = await file;
      const stream = createReadStream();
      const pathName = path.join(__dirname, `../../images/${filename}`);
      await stream.pipe(fs.createWriteStream(pathName));
      return {
        url: `http://localhost:4000/images/${filename}`,
      };
    },
  },
};
