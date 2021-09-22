import { mockDbQuery } from "../defResolver/mock.defResolver";

export const mockResolvers = {
  Query: {
    test: () => "Works!",
  },
  Mutation: {
    mockDb: mockDbQuery,
  },
};
