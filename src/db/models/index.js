//Este archivo tendrá todo el setup de los modelos
const { Empresa, EmpresaSchema } = require('./empresasModel');
const { Contratos, ContratosSchema } = require('./contratosModel');
const { Users, UsersSchema } = require('./usersModel');
const { PersonalEmp, PersonalEmpSchema } = require('./personalEmpModel');
const { MtrTickets, mtrTicketsSchema } = require('./mtrTicketsModel');
const { DetTickets, detTicketsSchema } = require('./detTicketsModel');
const {
  ControlTickets,
  controlTicketsSchema,
} = require('./controlTicketsModel');
const { PlanesMant, planesSchema } = require('./planesMantModel');
const { Categories, categorySchema } = require('./categoryModel');
const { Agentes, agentesSchema } = require('./agentesModel');

function setupModels(sequelize) {
  //Inicializo la clase con init() que requiere el esquema y la conexión
  Empresa.init(EmpresaSchema, Empresa.config(sequelize));
  Contratos.init(ContratosSchema, Contratos.config(sequelize));
  Users.init(UsersSchema, Users.config(sequelize));
  PersonalEmp.init(PersonalEmpSchema, PersonalEmp.config(sequelize));
  MtrTickets.init(mtrTicketsSchema, MtrTickets.config(sequelize));
  DetTickets.init(detTicketsSchema, DetTickets.config(sequelize));
  ControlTickets.init(controlTicketsSchema, ControlTickets.config(sequelize));
  PlanesMant.init(planesSchema, PlanesMant.config(sequelize));
  Categories.init(categorySchema, Categories.config(sequelize));
  Agentes.init(agentesSchema, Agentes.config(sequelize));

  //Relaciones entre tablas para FK
  Empresa.assocciate(sequelize.models);
  Contratos.assocciate(sequelize.models);
  Users.assocciate(sequelize.models);
  PersonalEmp.assocciate(sequelize.models);
  MtrTickets.assocciate(sequelize.models);
  DetTickets.assocciate(sequelize.models);
  ControlTickets.assocciate(sequelize.models);
  Agentes.assocciate(sequelize.models);
}

module.exports = setupModels;
