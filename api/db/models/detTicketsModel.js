const { Model, DataTypes, Sequelize } = require("sequelize");

const DET_TICKETS_TABLE = "det_tickets";
const { MTR_TICKETS_TABLE } = require("./mtrTicketsModel");
const { AGENTES_TABLE } = require("./agentesModel");

//Indicar que esquema se requiere que se cree en la base de datos, es decir sus campos y atributos de campo
const detTicketsSchema = {
  id_ticket: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER,
    references: {
      model: MTR_TICKETS_TABLE,
      key: "id_ticket",
    },
    onUpdate: "CASCADE",
    onDelete: "RESTRICT",
  },
  id_solicitud: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  descripcion: {
    allowNull: false,
    type: DataTypes.TEXT,
  },
  modulo: {
    type: DataTypes.STRING(15),
    comment:
      "Indicador módulo origen del sistema en donde tiene el problema si el usuario lo conoce, y si el soporte está relacionado con SiGeM",
  },
  id_categ_supuesta: {
    type: DataTypes.STRING(3),
    comment:
      "Para vincular a un tipo de categoría de la solicitud, ej: Error del sistema, mal manejo de usuario, consulta general, etc. Esta categoría será la suposición que considere el cliente",
  },
  id_categ_final: {
    type: DataTypes.STRING(3),
    comment:
      "Para vincular a un tipo de categoría de la solicitud, ej: Error del sistema, mal manejo de usuario, consulta general, etc. Esta será la categoría final que coloque el agente de soporte despues de evaluar la solicitud",
  },
  capturas: {
    type: DataTypes.JSON,
    comment:
      "Json donde se almacenarán rutas de las imágenes de diferentes capturas que desee subir el usuario de la solicitud si fuera el caso.",
  },
  agente_asig: {
    type: DataTypes.STRING(4),
    references: {
      model: AGENTES_TABLE,
      key: "id_agente",
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
    comment: "Agente que está dando solución a la solicitud dentro del ticket",
  },
  fecha_ini_solucion: {
    type: DataTypes.DATE,
    comment:
      "Fecha y hora inicial real en que se empieza atender la solicirud del ticket",
  },
  fecha_fin_solucion: {
    type: DataTypes.DATE,
    comment:
      "Fecha y hora final real en que se da solución a la solicitud del ticket",
  },
  solucion: {
    type: DataTypes.TEXT,
    comment:
      "Detalle de la solución de la solicitud por parte del agente de soporte",
  },
  estatus: {
    allowNull: false,
    type: DataTypes.STRING(11),
    defaultValue: "solicitado",
    comment:
      "Determina el estado de la solicitud (pendiente, proceso, pausado, reasignado, finalizado, anulado)",
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

class DetTickets extends Model {
  static assocciate(models) {
    this.belongsTo(models.MtrTickets, {
      as: "mtr_tickets",
      // foreignKey: ["id_cliente", "id_emp"],
      foreignKey: "id_ticket",
    });
    this.belongsTo(models.Agentes, {
      as: "agentes_sop",
      foreignKey: "agente_asig",
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: DET_TICKETS_TABLE,
      modelName: "DetTickets",
      timestamps: false,
    };
  }
}

module.exports = { DET_TICKETS_TABLE, detTicketsSchema, DetTickets };
