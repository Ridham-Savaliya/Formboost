const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_DATABASE || "formboost_db",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: process.env.DB_LOGGING === "true"
  },
  test: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_DATABASE
      ? process.env.DB_DATABASE + "_test"
      : "formboost_test_db",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "mysql",
    logging: false
  }
};
