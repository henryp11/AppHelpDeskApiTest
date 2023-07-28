"use strict";
const {
  PERSONAL_EMP_TABLE,
  PersonalEmpSchema,
} = require("../models/personalEmpModel");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable(PERSONAL_EMP_TABLE, PersonalEmpSchema);
  },

  async down(queryInterface) {
    await queryInterface.dropTable(PERSONAL_EMP_TABLE);
  },
};
