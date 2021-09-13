import { uploadFileMutation } from "../defResolver/file.defResolver";

export const uploadResolvers = {
  Query: {
    test: () => "Works!",
  },
  Mutation: {
    uploadFile: uploadFileMutation,
  },
};
