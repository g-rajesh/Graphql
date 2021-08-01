const dotenv = require("dotenv");

const {
     parsed: { DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_HOST, DB_DIALECT },
} = dotenv.config();

module.exports = {
     username: DB_USERNAME,
     password: DB_PASSWORD,
     database: DB_DATABASE,
     host: DB_HOST,
     dialect: DB_DIALECT,
};
