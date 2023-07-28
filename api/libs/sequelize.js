const { Sequelize } = require("sequelize");
const { config } = require("../../config/config.js");
const setupModels = require("../db/models"); //traigo el modelo desde el index de modelos

//Primero pasar la URI de conexión
const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const URI = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`;

//Validando opciones para tipo de ambiente
const options = {
  dialect: "postgres",
  logging: config.isProd ? false : true,
};

//Validación si se despliega en Heroku para añadir opciones de ssl
if (config.isProd) {
  //Dialext options es propio de sequelice para añadir las opción extrar que pida el despleigue, en este caso el ssl de heroku
  options.dialectOptions = {
    ssl: {
      rejectUnauthorized: false,
    },
  };
}
//Segundo creo una instancio de sequelize para gestionarla, automaticamente
//Sequelize va a utilizar el concepto de Pool por detras. El objeto se le manda como parámetro
//La URI de conexión y un objeto con el atributo dialect que indica a que base de datos se debe conectar

const sequelize = new Sequelize(URI, options);

//Llamo la configuración de model despues de crear la instancia de la conexión de Sequelize
setupModels(sequelize);

//Se sincroniza para crear la tabla con el esquema que se le indico en el modelo
//Es decir creará la tabla con todas las caracteristicas directamente en la base de datos si esta noexiste en la DB.
// sequelize.sync(); //Se uso para Dev pero ahora se configurará migraciones

module.exports = sequelize;
