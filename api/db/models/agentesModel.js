const { Model, DataTypes, Sequelize } = require("sequelize");

//Empezar a definir el nombre de la tabla con toda la estructura, nombre de la tabla en mayúsculas
const AGENTES_TABLE = "agentes_sop";

//Indicar que esquema se requiere que se cree en la base de datos, es decir sus campos y atributos de campo
const agentesSchema = {
  id_agente: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.STRING(4),
  },
  cedula: {
    allowNull: false,
    type: DataTypes.STRING(10),
  },
  nombre: {
    allowNull: false,
    type: DataTypes.STRING(50),
  },
  fecha_nacimiento: {
    type: DataTypes.DATEONLY,
  },
  sexo: {
    type: DataTypes.CHAR(1),
  },
  fecha_ingreso: {
    allowNull: false,
    type: DataTypes.DATEONLY,
  },
  fecha_salida: {
    type: DataTypes.DATEONLY,
  },
  cargo: {
    allowNull: false,
    type: DataTypes.STRING(50),
  },
  horario: {
    type: DataTypes.JSON,
  },
  nivel_atencion: {
    allowNull: false,
    type: DataTypes.CHAR(2),
    defaultValue: "N1",
  },
  estatus: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  created_at: {
    allowNull: false,
    type: DataTypes.DATE,
    field: "created_at",
    defaultValue: Sequelize.NOW,
  },
  updated_at: {
    allowNull: false,
    type: DataTypes.DATE,
    field: "updated_at",
    defaultValue: Sequelize.NOW,
  },
};

class Agentes extends Model {
  static config(sequelize) {
    return {
      sequelize,
      tableName: AGENTES_TABLE,
      modelName: "Agentes",
      timestamps: false,
    };
  }
}

module.exports = { AGENTES_TABLE, agentesSchema, Agentes };
