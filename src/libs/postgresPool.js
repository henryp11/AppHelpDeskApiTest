const { Pool } = require("pg");
const { config } = require("../../config/config.js");

const options = {};

//Para despliegue en producción
if (config.isProd) {
  options.connectionString = config.dbUrl;
  //PAra despliegue de heroku
  options.ssl = {
    rejectUnauthorized: false,
  };
} else {
  //Para ambiente desarrollo
  const USER = encodeURIComponent(config.dbUser);
  const PASSWORD = encodeURIComponent(config.dbPassword);
  const URI = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`;
  options.connectionString = URI; //Añado la uri para la inicialización del servicio
}

//Como se trae una clase se procede a crear el objeto con la configuración de conexión
//En este caso Pool Ya realiza un await interna para compartir la conexión con los servicios
// que lo necesiten, así que ya no requiero declarar la fución como async
const dbTesis = {
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "123456",
  database: "helpdesk_capacityv1",
};

const dbStore = {
  host: "localhost",
  port: 5432,
  user: "henry",
  password: "123456",
  database: "my_store",
};
// Pool ya realizará la conexión por lo que solo debo exportar el objeto
//Con el objeto y su atributo connectionString se reconoce el URI de conexión
const pool = new Pool(options);

module.exports = pool;
