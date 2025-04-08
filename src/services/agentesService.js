const boom = require('@hapi/boom');
//Se debe usar la llamada reservada por sequelize "models"
const { models } = require('../libs/sequelize'); //Usando ORM PARA USAR MODELOS

/** Clase para ejectuar los diferentes servicios para Agentes de soporte */
class AgentesServices {
  async find(query) {
    const { cedagent } = query;

    const options = {
      where: {},
    };
    if (cedagent) {
      options.where.cedula = cedagent;
    }

    const answer = await models.Agentes.findAll(options);
    return answer;
  }

  //Se utilizará para mostrar al inicio de la pantalla de agentes la cantidad de solicitudes en proceso de atención
  async findSolicAgentes(query) {
    const { agent } = query;
    const estatusEspecifico = ['asignado', 'proceso', 'pausado', 'reasignado'];
    const options = {
      where: {
        '$det_tickets.estatus$': estatusEspecifico,
      },
      include: ['det_tickets'],
    };

    const answer = await models.Agentes.findAll(options);
    return answer;
  }

  async create(data) {
    const newRegister = await models.Agentes.create(data);
    return { message: 'Registro creado con éxito', newRegister };
  }

  async filterId(id) {
    const answer = await models.Agentes.findByPk(id);
    if (!answer) {
      throw boom.notFound('Agente Soporte no encontrado');
    }
    return answer;
  }

  async update(id, changes) {
    const findReg = await this.filterId(id);
    const dataUpdate = await findReg.update(changes);
    return { message: 'Datos actualizados', dataUpdate };
  }

  async delete(id) {
    const findReg = await this.filterId(id);
    await findReg.destroy();
    return { message: `Agente ${id} eliminado!` };
  }
}

module.exports = AgentesServices;
