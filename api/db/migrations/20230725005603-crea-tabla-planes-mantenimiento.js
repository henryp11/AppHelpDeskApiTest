"use strict";
const { PLANES_TABLE, planesSchema } = require("../models/planesMantModel");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable(PLANES_TABLE, planesSchema);
  },

  async down(queryInterface) {
    await queryInterface.dropTable(PLANES_TABLE);
  },
};
