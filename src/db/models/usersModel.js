const { Model, DataTypes, Sequelize } = require('sequelize');

const USERS_TABLE = 'usuarios';

const UsersSchema = {
  id_user: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  username: {
    allowNull: false,
    type: DataTypes.STRING(20),
    unique: true,
  },
  mail: {
    allowNull: false,
    type: DataTypes.STRING(100),
    unique: true,
  },
  password: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  recovery_token: {
    field: 'recovery_token',
    allowNull: true,
    type: DataTypes.STRING,
  },
  rol: {
    allowNull: false,
    type: DataTypes.STRING(10),
    defaultValue: 'cliente',
  },
  estatus: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  created_at: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW,
  },
  updated_at: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'updated_at',
    defaultValue: Sequelize.NOW,
  },
};

class Users extends Model {
  static assocciate(models) {
    this.hasOne(models.PersonalEmp, {
      as: 'personalEmp',
      foreignKey: 'id_user',
    });

    this.hasOne(models.Agentes, {
      as: 'agentesSop',
      foreignKey: 'id_user',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: USERS_TABLE,
      modelName: 'Users',
      timestamps: false,
    };
  }
}

module.exports = { USERS_TABLE, UsersSchema, Users };
