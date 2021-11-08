import { Connection } from "typeorm";
import connectionTestMethods from "./../test/config/testServerMethods";

export const loadFixtures = async (connection: Connection) => {
  await connectionTestMethods.uploadFixture(connection, "_user_.sql");
  await connectionTestMethods.uploadFixture(connection, "_item_.sql");
  await connectionTestMethods.uploadFixture(connection, "_image_.sql");
  await connectionTestMethods.uploadFixture(
    connection,
    "_item_wishers_user_.sql"
  );
  console.log("Loaded!!!");
};
