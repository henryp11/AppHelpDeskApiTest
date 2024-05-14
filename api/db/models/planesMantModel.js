const { Model, DataTypes, Sequelize } = require('sequelize');

const PLANES_TABLE = 'planes_mant';

const planesSchema = {
  id_plan: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.STRING(3),
  },
  nombre_plan: {
    allowNull: false,
    type: DataTypes.STRING(50),
  },
  abrev: {
    type: DataTypes.CHAR(3),
    comment: 'Abreviatura para identificar el plan',
  },
  dias_vigencia: {
    allowNull: false,
    type: DataTypes.INTEGER,
    comment: 'Duración del plan en días',
  },
  horas_sop: {
    allowNull: false,
    type: DataTypes.INTEGER,
    comment: 'Cantidad de horas de soporte',
  },
  estatus: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Determina el estado del plan (true: activo - false: inactivo)',
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

class PlanesMant extends Model {
  static assocciate(models) {
    this.hasMany(models.Contratos, { as: 'contratos', foreignKey: 'id_plan' });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: PLANES_TABLE,
      modelName: 'PlanesMant',
      timestamps: false,
    };
  }
}

module.exports = { PLANES_TABLE, planesSchema, PlanesMant };
