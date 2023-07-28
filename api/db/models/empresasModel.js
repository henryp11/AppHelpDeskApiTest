const { Model, DataTypes, Sequelize } = require("sequelize");

//Empezar a definir el nombre de la tabla con toda la estructura, nombre de la tabla en mayúsculas
const EMPRESAS_TABLE = "empresas";

//Indicar que esquema se requiere que se cree en la base de datos, es decir sus campos y atributos de campo
const EmpresaSchema = {
  id_emp: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.STRING,
  },
  nombre_emp: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
  },
  ruc: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
  },
  direccion: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  telefono: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  correo: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  correo_secund: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  ciudad: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  //Si deseo nombrar la variable en JS con Cammel case u otro nombre, debo especificar el campo al que
  //hará referencia en la base de datos, con el atributo field, ya que en bases de datos se usa snake case
  planMant: {
    allowNull: true,
    type: DataTypes.BOOLEAN,
    field: "plan_mant",
    defaultValue: false,
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

class Empresa extends Model {
  // LLamaré métodos estáticos para no crear el objeto y funcionará para definir asociaciones
  static assocciate(models) {
    this.hasMany(models.Contratos, { as: "contratos", foreignKey: "id_emp" });
    this.hasMany(models.PersonalEmp, {
      as: "personal_emp",
      foreignKey: "id_emp",
    });
  }

  static config(sequelize) {
    //Se requiere una conexión en este caso desde sequelize
    return {
      sequelize,
      tableName: EMPRESAS_TABLE,
      modelName: "Empresa",
      timestamps: false,
    };
  }
}

module.exports = { EMPRESAS_TABLE, EmpresaSchema, Empresa };
