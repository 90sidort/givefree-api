import {
  Connection,
  ConnectionOptions,
  createConnection,
  getConnection,
} from "typeorm";
import loadFixtures from "../fixtures/loadFixtures";

const connectionTestMethods = {
  async openDB(config: ConnectionOptions) {
    return await createConnection(config);
  },

  async uploadFixture(connection: Connection, file: string) {
    try {
      await loadFixtures(connection, file);
    } catch (err) {
      console.log(err);
    }
  },

  async openAndLoadDB(config: ConnectionOptions, file: string) {
    const connection = await this.openDB(config);
    await loadFixtures(connection, file);
  },

  async closeDB() {
    await getConnection().close();
  },

  async clearDB() {
    const connection = getConnection();
    const entities = connection.entityMetadatas;

    entities.forEach(async (entity) => {
      const repository = connection.getRepository(entity.name);
      await repository.query(`DELETE FROM ${entity.tableName}`);
    });
  },
};
export default connectionTestMethods;
