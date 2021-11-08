import {
  Connection,
  ConnectionOptions,
  createConnection,
  getConnection,
} from "typeorm";

import loadFixtures from "../../fixtures/loadFixtures";

const connectionTestMethods = {
  async openDB(config: ConnectionOptions) {
    const newConnection = await createConnection(config);
    return newConnection;
  },

  getEntities(connection: Connection) {
    const entities = [] as any;
    connection.entityMetadatas.forEach((x) =>
      entities.push({ name: x.name, tableName: x.tableName })
    );
    return entities;
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

  async cleanAll(connection: Connection, entities: any) {
    try {
      for (const entity of entities) {
        const repository = await connection.getRepository(entity.name);
        await repository.query(`TRUNCATE TABLE "${entity.tableName}" CASCADE;`);
      }
    } catch (error) {
      throw new Error(`ERROR: Cleaning test db: ${error}`);
    }
  },

  async closeDB() {
    try {
      const connection = getConnection();
      await connection.close();
    } catch (err) {
      console.log(err);
    }
  },
};
export default connectionTestMethods;
