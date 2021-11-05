import connectionTestMethods from "./../test/testServerMethods";
import { config } from "../test/testServerConfig";

export const loadFixtures = async () => {
  const connection = await connectionTestMethods.openDB(config);
  await connectionTestMethods.uploadFixture(connection, "_user_.sql");
  await connectionTestMethods.uploadFixture(connection, "_item_.sql");
  await connectionTestMethods.uploadFixture(connection, "_image_.sql");
  await connectionTestMethods.uploadFixture(
    connection,
    "_item_wishers_user_.sql"
  );
  console.log("Loaded!!!");
  await connection.close();
};

// loadFixtures();
