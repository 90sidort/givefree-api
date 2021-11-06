import { getConnection } from "typeorm";

import { loadFixtures } from "./../../fixtures/loadScript";
import connectionTestMethods from "../../test/config/testServerMethods";

export const mockDbQuery = async () => {
  try {
    if (process.env.MODE !== "prod") {
      const connection = getConnection();
      const entities = await connectionTestMethods.getEntities(connection);
      await connectionTestMethods.cleanAll(connection, entities);
      await loadFixtures(connection);
      return true;
    }
    return false;
  } catch (err) {
    throw new Error(err ? err : "Server error!");
  }
};
