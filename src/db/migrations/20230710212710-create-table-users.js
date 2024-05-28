"use strict";

const { USERS_TABLE, UsersSchema } = require("../models/usersModel");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  //Aquí se usa la API de sequelizr llamada queryInterface para ejecutar los comandos
  async up(queryInterface) {
    await queryInterface.createTable(USERS_TABLE, UsersSchema);
  },

  //Con down se usa para revertir cambios, es decir drop de tablas
  async down(queryInterface) {
    await queryInterface.dropTable(USERS_TABLE);
  },
};
