"use strict";
const {
  CONTRATOS_TABLE,
  ContratosSchema,
} = require("../models/contratosModel");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable(CONTRATOS_TABLE, ContratosSchema);
  },

  async down(queryInterface) {
    await queryInterface.dropTable(CONTRATOS_TABLE);
  },
};
