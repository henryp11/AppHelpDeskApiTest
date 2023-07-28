"use strict";

const { EMPRESAS_TABLE, EmpresaSchema } = require("../models/empresasModel");
//Si tengo todos los modelos listos para usar se puede crear directamente la interfaz para la primera migración de todos
// const { PLANES_MANTEN_TABLE, PlanesSchema } = require("../models/planesModel");
// const { EMPLEADOS_TABLE, EmpleadosSchema } = require("../models/empleadosModel");
// const { MTRTICKETS_TABLE, MtrTicketsSchema } = require("../models/mtrTicketsModel");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  //Aquí se usa la API de sequelizr llamada queryInterface para ejecutar los comandos
  async up(queryInterface) {
    await queryInterface.createTable(EMPRESAS_TABLE, EmpresaSchema);
    // await queryInterface.createTable(PLANES_MANTEN_TABLE, PlanesSchema);
    // await queryInterface.createTable(EMPLEADOS_TABLE, EmpleadosSchema);
    // await queryInterface.createTable(MTRTICKETS_TABLE, MtrTicketsSchema);
  },

  //Con down se usa para revertir cambios, es decir drop de tablas
  async down(queryInterface) {
    await queryInterface.dropTable(EMPRESAS_TABLE);
  },
};
