// require('dotenv').config();
require('dotenv').config({ path: `./.env.${process.env.NODE_ENV}` });
module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_USERPASSWORD,
    database: process.env.DATABASE,
    host: '127.0.0.1',
    port: 5432, // Порт подключения к БД
    dialect: 'postgres',
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_USERPASSWORD,
    database: process.env.DATABASE,
    host: '127.0.0.1',
    port: 5432, // Порт подключения к БД
    dialect: 'postgres',
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_USERPASSWORD,
    database: process.env.DATABASE,
    host: '127.0.0.1',
    port: 5432, // Порт подключения к БД
    dialect: 'postgres',
  },
};
