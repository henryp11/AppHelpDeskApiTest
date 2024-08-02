const { Model, DataTypes, Sequelize } = require('sequelize');

const MTR_TICKETS_TABLE = 'mtr_tickets';
const { PERSONAL_EMP_TABLE } = require('./personalEmpModel');

//Indicar que esquema se requiere que se cree en la base de datos, es decir sus campos y atributos de campo
const mtrTicketsSchema = {
  id_ticket: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  id_cliente: {
    allowNull: false,
    type: DataTypes.STRING(10),
    comment: 'Cedula de cliente proveniente de personal_emp, FK doble',
    references: {
      model: PERSONAL_EMP_TABLE,
      key: 'id_per',
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  },
  id_emp: {
    allowNull: false,
    type: DataTypes.STRING(4),
    comment: 'Empresa que pertence proveniente de personal_emp, FK doble',
    references: {
      model: PERSONAL_EMP_TABLE,
      key: 'id_emp',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
  prioridad: {
    allowNull: false,
    type: DataTypes.STRING(4),
    defaultValue: 'NORM',
    comment:
      'Determina el nivel de prioridad de la solicitud (NORM=Normal, WAIT= Puede Esperar, URGE= Urgente, SINP= Petición sin plan Mant',
  },
  id_tipo: {
    type: DataTypes.STRING(3),
    comment: 'Determina tipo de soporte',
  },
  descrip_tk: {
    allowNull: false,
    type: DataTypes.STRING(255),
    defaultValue: 'Ticket sin descripción',
  },
  fecha_reg: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    comment:
      'Fecha-hora en que se registro inicialmente el Ticket por parte del cliente',
  },
  fecha_ini_sop: {
    type: DataTypes.DATE,
    comment: 'Fecha-hora real en que se comienza a dar atención al ticket',
  },
  fecha_fin_sop: {
    type: DataTypes.DATE,
    comment:
      'Fecha-hora real en que se finaliza la atención de todas las solicitudes en el ticket',
  },
  tiempo_calc_sop: {
    type: DataTypes.DECIMAL(10, 2),
    comment:
      'Tiempo EN HORAS transcurrido entre el inicio de la atención y el final de la atención de todo el contenido del ticket',
  },
  tiempo_diferencial: {
    type: DataTypes.DECIMAL(10, 2),
    comment:
      'Tiempo que considere el agente de soporte que deba sumar o restar al tiempo calculado por cualquier motivo que pudo presentarse en el proceso de atención del ticket',
  },
  tiempo_real_sop: {
    type: DataTypes.DECIMAL(10, 2),
    comment:
      'Tiempo real de soporte siendo la diferencia entre el tiempo calculado y el tiempo diferencial',
  },
  estatus: {
    allowNull: false,
    type: DataTypes.STRING(11),
    defaultValue: 'solicitado',
    commnet:
      'Determina el estado del ticket (solicitado, asignado, proceso, detenido, reasignado, finalizado, anulado)',
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

class MtrTickets extends Model {
  // LLamaré métodos estáticos para no crear el objeto y funcionará para definir asociaciones
  static assocciate(models) {
    this.belongsTo(models.PersonalEmp, {
      as: 'personal_emp',
      foreignKey: 'id_cliente',
    });
    this.hasMany(models.DetTickets, {
      as: 'det_tickets',
      foreignKey: 'id_ticket',
    });
    this.belongsTo(models.Categories, {
      as: 'categorias_sop',
      foreignKey: 'id_tipo',
    });
  }

  static config(sequelize) {
    //Se requiere una conexión en este caso desde sequelize
    return {
      sequelize,
      tableName: MTR_TICKETS_TABLE,
      modelName: 'MtrTickets',
      timestamps: false,
    };
  }
}

module.exports = { MTR_TICKETS_TABLE, mtrTicketsSchema, MtrTickets };
