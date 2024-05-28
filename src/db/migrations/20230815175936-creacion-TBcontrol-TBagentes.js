"use strict";
const {
  CONTROL_TICKETS_TABLE,
  controlTicketsSchema,
} = require("../models/controlTicketsModel");

const { AGENTES_TABLE, agentesSchema } = require("../models/agentesModel");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable(
      CONTROL_TICKETS_TABLE,
      controlTicketsSchema
    );
    await queryInterface.createTable(AGENTES_TABLE, agentesSchema);
  },

  async down(queryInterface) {
    await queryInterface.dropTable(CONTROL_TICKETS_TABLE);
    await queryInterface.dropTable(AGENTES_TABLE);
  },
};
