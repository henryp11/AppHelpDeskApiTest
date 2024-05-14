const { Model, DataTypes, Sequelize } = require('sequelize');

const CATEGORY_TABLE = 'categorias_sop';

const categorySchema = {
  id_cat: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.STRING(3),
    comment: 'Determina el tipo de soporte en general del ticket',
  },
  descrip: {
    allowNull: false,
    type: DataTypes.STRING(40),
  },
  estatus: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment:
      'Determina el estado de la categoría (true: activo - false: inactivo)',
  },
  created_at: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'updated_at',
    defaultValue: DataTypes.NOW,
  },
};

class Categories extends Model {
  // static assocciate(models) {
  //   this.hasMany(models.Contratos, { as: "contratos", foreignKey: "id_plan" });
  // }

  static config(sequelize) {
    return {
      sequelize,
      tableName: CATEGORY_TABLE,
      modelName: 'Categories',
      timestamps: false,
    };
  }
}

module.exports = { CATEGORY_TABLE, categorySchema, Categories };
