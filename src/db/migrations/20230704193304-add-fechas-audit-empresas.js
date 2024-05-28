"use strict";
const { EMPRESAS_TABLE, EmpresaSchema } = require("../models/empresasModel");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.addColumn(
      EMPRESAS_TABLE,
      "createdAt",
      EmpresaSchema.createdAt
    );
    await queryInterface.addColumn(
      EMPRESAS_TABLE,
      "updatedAt",
      EmpresaSchema.updatedAt
    );
  },

  async down(queryInterface) {
    await queryInterface.removeColumn(EMPRESAS_TABLE, "createdAt");
    await queryInterface.removeColumn(EMPRESAS_TABLE, "updatedAt");
  },
};
