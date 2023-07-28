const { config } = require("../../config/config.js");

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const URI = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`;

//Se debe exportar los ambientes de trabajo desarrollo y producción con sus parametros
module.exports = {
  development: {
    url: URI,
    dialect: "postgres",
  },
  production: {
    url: config.dbUrl, //URL de server en producción
    dialect: "postgres",
    //ESTE SSL SOLO PARA HEROKU, LAS OPCIONES SE COLOCA CON "dialectOptions"
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
};
