const { Model, DataTypes, Sequelize } = require("sequelize");

const PERSONAL_EMP_TABLE = "personal_emp";
const { EMPRESAS_TABLE } = require("./empresasModel");
const { USERS_TABLE } = require("./usersModel");

//Indicar que esquema se requiere que se cree en la base de datos, es decir sus campos y atributos de campo
const PersonalEmpSchema = {
  id_per: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.STRING(10),
    comment:
      "Número de cédula o comprobante de identificación del empleado perteneciente a una empresa",
  },
  id_emp: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.STRING(4),
    references: {
      model: EMPRESAS_TABLE,
      key: "id_emp",
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  },
  nombre: {
    allowNull: false,
    type: DataTypes.STRING(50),
  },
  telf1: {
    allowNull: false,
    type: DataTypes.STRING(15),
  },
  telf2: {
    allowNull: true,
    type: DataTypes.STRING(15),
  },
  cargo: {
    allowNull: true,
    type: DataTypes.STRING(15),
  },
  depto: {
    allowNull: true,
    type: DataTypes.STRING(15),
  },
  correo: {
    allowNull: true,
    type: DataTypes.STRING(100),
  },
  id_user: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: USERS_TABLE,
      key: "id_user",
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
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
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    allowNull: false,
    type: DataTypes.DATE,
    field: "updated_at",
    defaultValue: DataTypes.NOW,
  },
};

class PersonalEmp extends Model {
  static assocciate(models) {
    //Relación al modelo de empresas, uso this directo porque me refiero a la misma clase
    this.belongsTo(models.Empresa, { as: "empresa", foreignKey: "id_emp" });
    this.belongsTo(models.Users, { as: "users", foreignKey: "id_user" });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: PERSONAL_EMP_TABLE,
      modelName: "PersonalEmp",
      timestamps: false,
    };
  }
}

module.exports = { PERSONAL_EMP_TABLE, PersonalEmpSchema, PersonalEmp };
