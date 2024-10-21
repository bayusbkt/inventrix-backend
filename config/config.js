import "dotenv/config";

export default {
  development: {
    username: process.env.DBUSERNAME,
    password: process.env.DBPASSWORD,
    database: process.env.DB_DEV_NAME,
    host: process.env.HOST,
    dialect: process.env.DIALECT,
  },
  test: {
    username: process.env.DBUSERNAME,
    password: process.env.DBPASSWORD,
    database: process.env.DB_TEST_NAME,
    host: process.env.HOST,
    dialect: process.env.DIALECT,
  },
  production: {
    username: process.env.DBUSERNAME,
    password: process.env.DBPASSWORD,
    database: process.env.DB_PROD_NAME,
    host: process.env.HOST,
    dialect: process.env.DIALECT,
  },
};
