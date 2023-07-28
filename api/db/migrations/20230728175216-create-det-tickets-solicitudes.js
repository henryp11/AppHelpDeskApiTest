"use strict";
const {
  DET_TICKETS_TABLE,
  detTicketsSchema,
} = require("../models/detTicketsModel");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable(DET_TICKETS_TABLE, detTicketsSchema);
  },

  async down(queryInterface) {
    await queryInterface.dropTable(DET_TICKETS_TABLE);
  },
};
