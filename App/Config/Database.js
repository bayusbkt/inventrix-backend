import { Sequelize } from "sequelize";
import dotenv from "dotenv/config";

let dbName;
process.env.STATUS == "PRODUCTION"
  ? (dbName = process.env.DB_PROD_NAME)
  : (dbName = process.env.DB_DEV_NAME);

const sequelize = new Sequelize(
  dbName,
  process.env.DBUSERNAME,
  process.env.DBPASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
  }
);

const connection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database Connected");
    // await sequelize.sync({ alter: true });
    // console.log("All models were synchronized successfully");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export { sequelize, connection };
