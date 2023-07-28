const { Model, DataTypes, Sequelize } = require("sequelize");

//Empezar a definir el nombre de la tabla con toda la estructura, nombre de la tabla en mayúsculas
const CONTRATOS_TABLE = "contratos";
//Así traigo el nombre de la tabla desde el modelo
const { EMPRESAS_TABLE } = require("./empresasModel");
const { PLANES_TABLE } = require("./planesMantModel");

//Indicar que esquema se requiere que se cree en la base de datos, es decir sus campos y atributos de campo
const ContratosSchema = {
  id_contrato: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.STRING(7),
  },
  id_emp: {
    allowNull: false,
    type: DataTypes.STRING(4),
    references: {
      model: EMPRESAS_TABLE,
      key: "id_emp",
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  },
  id_plan: {
    allowNull: false,
    type: DataTypes.CHAR(3),
    references: {
      model: PLANES_TABLE,
      key: "id_plan",
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  },
  fecha_inicio: {
    allowNull: false,
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
  },
  fecha_fin: {
    allowNull: false,
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
  },
  fecha_extendida: {
    type: DataTypes.DATEONLY,
  },
  flag_vigente: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  factura: {
    allowNull: true,
    type: DataTypes.STRING(16),
  },
  observac: {
    allowNull: true,
    type: DataTypes.STRING(50),
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

class Contratos extends Model {
  static assocciate(models) {
    //Relación al modelo de empresas, uso this directo porque me refiero a la misma clase
    this.belongsTo(models.Empresa, { as: "empresa", foreignKey: "id_emp" });
    this.belongsTo(models.PlanesMant, {
      as: "planes_mant",
      foreignKey: "id_plan",
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: CONTRATOS_TABLE,
      modelName: "Contratos",
      timestamps: false,
    };
  }
}

module.exports = { CONTRATOS_TABLE, ContratosSchema, Contratos };
