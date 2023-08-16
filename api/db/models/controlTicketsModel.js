const { Model, DataTypes, Sequelize } = require("sequelize");

const CONTROL_TICKETS_TABLE = "control_tickets";
const { DET_TICKETS_TABLE } = require("./detTicketsModel");
const { AGENTES_TABLE } = require("./agentesModel");

//Indicar que esquema se requiere que se cree en la base de datos, es decir sus campos y atributos de campo
const controlTicketsSchema = {
  id_control: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  id_ticket: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: DET_TICKETS_TABLE,
      key: "id_ticket",
    },
    onUpdate: "CASCADE",
    onDelete: "RESTRICT",
  },
  id_solicitud: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: DET_TICKETS_TABLE,
      key: "id_solicitud",
    },
    onUpdate: "CASCADE",
    onDelete: "RESTRICT",
  },
  id_agente: {
    allowNull: false,
    type: DataTypes.STRING(4),
    references: {
      model: AGENTES_TABLE,
      key: "id_agente",
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
    comment: "Agente que procesa la solicitud en ese momento.",
  },
  fecha_ini_atencion: {
    type: DataTypes.DATEONLY,
    comment:
      "Fecha inicial real en que se da atención a la solicitud del ticket",
  },
  hora_ini_atencion: {
    type: DataTypes.TIME,
    comment:
      "Hora inicial real en que se da atención a la solicitud del ticket",
  },
  fecha_fin_atencion: {
    type: DataTypes.DATEONLY,
    comment: "Fecha final real en que se da atención a la solicitud del ticket",
  },
  hora_fin_atencion: {
    type: DataTypes.TIME,
    comment: "Hora final real en que se da atención a la solicitud del ticket",
  },
  tiempo_calc: {
    type: DataTypes.DECIMAL(9, 6),
    comment: "Tiempo de soporte para cada fila de control",
  },
  reasignado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: "Indica si la solicitud tuvo que ser reasignada a otro agente",
  },
  motivo_reasig: {
    type: DataTypes.STRING(255),
    comment: "Motivo de reasignación de la solicitud",
  },
  nivel_complejidad: {
    type: DataTypes.CHAR(2),
    defaultValue: "N1",
    comment:
      "Indica el nivel de complejidad de la solicitud en ser atendida, la cual puede ir variando con cada pausa o reasignación de la solicitud",
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

class ControlTickets extends Model {
  static assocciate(models) {
    this.belongsTo(models.DetTickets, {
      as: "det_tickets",
      foreignKey: "id_solicitud",
    });
    this.belongsTo(models.Agentes, {
      as: "agentes_sop",
      foreignKey: "id_agente",
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: CONTROL_TICKETS_TABLE,
      modelName: "ControlTickets",
      timestamps: false,
    };
  }
}

module.exports = {
  CONTROL_TICKETS_TABLE,
  controlTicketsSchema,
  ControlTickets,
};
