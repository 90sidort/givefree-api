import { loadFixtures } from "./../../fixtures/loadScript";

export const mockDbQuery = async () => {
  try {
    if (process.env.MODE === "dev") {
      await loadFixtures();
      return true;
    }
    return false;
  } catch (err) {
    throw new Error(err ? err : "Server error!");
  }
};
