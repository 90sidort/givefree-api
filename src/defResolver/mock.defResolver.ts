import { createConnection } from "typeorm";

import { loadFixtures } from "./../../fixtures/loadScript";
import connectionTestMethods from "../../test/config/testServerMethods";
import { config } from "../../test/config/testServerConfig";

export const mockDbQuery = async () => {
  try {
    if (process.env.MODE !== "prod") {
      const connection = await createConnection(config);
      const entities = await connectionTestMethods.getEntities(connection);
      await connectionTestMethods.cleanAll(connection, entities);
      await loadFixtures(connection);
      await connection.close();
      return true;
    }
    return false;
  } catch (err) {
    throw new Error(err ? err : "Server error!");
  }
};
