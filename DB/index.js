require("dotenv").config({ path: "../.env" });

let { DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

module.exports = {
    client: "postgresql",
    debug: true,
    // connection: {
    // user: DB_USERNAME,
    // host: DB_HOST,
    // port: DB_PORT,
    // database: DB_NAME,
    // password: DB_PASSWORD,
    // },
    connection:DB_HOST,
    pool: {
      min: 0,
      max: 20,
      propagateCreateError: false
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./migrations",
      loadExtensions: [".js"],
    },
    seeds: {
      directory: "./seeders",
    }
  };
  