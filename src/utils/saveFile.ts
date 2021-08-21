import * as path from "path";
import * as fs from "fs";

export const fileSaver = async (file: any) => {
  const { createReadStream, filename } = await file;
  const stream = createReadStream();
  const pathName = path.join(__dirname, `../../images/${filename}`);
  await stream.pipe(fs.createWriteStream(pathName));
  return `http://localhost:4000/${filename}`;
};
