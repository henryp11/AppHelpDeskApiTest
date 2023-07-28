const { Client } = require("pg");

//Como se trae una clase se procede a crear el objeto con la configuración de conexión
//Todo es Async por lo que creada la configuración se realiza en el await la conexión
// y se retorna el cliente
async function getConnection() {
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

  const client = new Client(dbTesis);
  await client.connect();
  return client;
}

module.exports = getConnection;
