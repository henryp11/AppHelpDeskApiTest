"use strict";
const {
  MTR_TICKETS_TABLE,
  mtrTicketsSchema,
} = require("../models/mtrTicketsModel");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable(MTR_TICKETS_TABLE, mtrTicketsSchema);
  },

  async down(queryInterface) {
    await queryInterface.dropTable(MTR_TICKETS_TABLE);
  },
};
