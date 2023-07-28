"use strict";
const { DataTypes } = require("sequelize");
const { CONTRATOS_TABLE } = require("../models/contratosModel");
const { PLANES_TABLE } = require("../models/planesMantModel");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.changeColumn(CONTRATOS_TABLE, "id_plan", {
      type: DataTypes.CHAR(3),
      references: {
        model: PLANES_TABLE,
        key: "id_plan",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  // async down(queryInterface) {
  //   await queryInterface.removeColumn(CONTRATOS_TABLE, "id_plan");
  // },
};
