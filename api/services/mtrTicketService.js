const boom = require('@hapi/boom');
const { Op } = require('sequelize'); //Para usar operadores de consultas directo desde sequelize
const { models } = require('../libs/sequelize'); //Usando ORM PARA USAR MODELOS

class MtrTicketServices {
  async find(query) {
    const { limit, offset, rol, idemp, idclient, tracking } = query;
    const options = {
      where: {},
      order: [['id_ticket', 'DESC']],
      include: [
        { association: 'personal_emp', include: 'empresa' },
        'det_tickets',
      ],
    }; //Para añadir opciones al método del ORM en este caso limit y offset
    //Valido si se envián los query params y los añado al objeto
    if (limit && offset) {
      options.limit = limit;
      options.offset = offset;
    }

    //Valido el rol si es distinto de admin, para que el SQL solo muestre los tickets de la empresa a la que pertenece el usuario
    // Si es admin por el contrario se debe mostrat todos los tickets para todas las empresas
    if (rol && idemp) {
      if (rol === 'supervisor') {
        options.where.id_emp = idemp;
        if (tracking === true) {
          //PARA TRACKING QUITO LOS ANULADOS Y FINALIZADOS.
          options.where.id_emp = idemp;
          options.where.estatus = [
            'solicitado',
            'asignado',
            'proceso',
            'detenido',
          ];
        }
      } else if (rol === 'cliente') {
        options.where.id_emp = idemp;
        options.where.id_cliente = idclient;
        if (tracking === true) {
          options.where.id_emp = idemp;
          options.where.id_cliente = idclient;
          options.where.estatus = [
            'solicitado',
            'asignado',
            'proceso',
            'detenido',
          ];
        }
      }
    }

    const answer = await models.MtrTickets.findAll(options);
    return answer;
  }

  //Filtrar ticket por su id, se asocia con data empresa y detalle del ticket(solicitudes)
  async filterId(id) {
    const options = {
      include: [
        { association: 'personal_emp', include: 'empresa' },
        'det_tickets',
      ],
    };
    const answer = await models.MtrTickets.findByPk(id, options);
    if (!answer) {
      throw boom.notFound('Ticket no encontrado');
    }
    return answer;
  }

  //Filtrar un objeto por su id
  async filterIdControlBySolicitud(id, id_solicitud) {
    const options = {
      where: {
        id_ticket: id,
        '$det_tickets.id_solicitud$': id_solicitud,
        '$det_tickets.control_tickets.id_solicitud$': id_solicitud,
      },
      include: [
        { association: 'personal_emp', include: 'empresa' },
        { association: 'det_tickets', include: 'control_tickets' },
      ],
    };
    // const answer = await models.MtrTickets.findByPk(id, options);
    const answer = await models.MtrTickets.findAll(options);
    if (!answer) {
      throw boom.notFound('Ticket no encontrado');
    }
    return answer;
  }

  //Para mostrar todos los tickets de un usuario por token
  async findByUser(userId) {
    const tickets = await models.MtrTickets.findAll({
      //El simbolo "$" permite a sequelize realizar una consulta anidada en base a la asociación
      //que deseo en este caso busco el id_user anidado en el personal_emp y su asociación de users
      where: {
        '$personal_emp.users.id_user$': userId,
      },
      include: [
        'det_tickets',
        { association: 'personal_emp', include: ['users'] },
      ],
    });
    return tickets;
  }

  async create(data, clientId, idEmp) {
    const newRegister = await models.MtrTickets.create({
      ...data,
      id_cliente: clientId,
      id_emp: idEmp,
    });
    return {
      message: 'Ticket registrado, proceda a ingresar su(s) solicitud(es)',
      newRegister,
    };
  }

  async update(id, changes) {
    const findReg = await this.filterId(id);
    const dataUpdate = await findReg.update(changes);
    return { message: 'Datos actualizados', dataUpdate };
  }

  async delete(id) {
    const findReg = await this.filterId(id);
    await findReg.destroy();
    return { message: `Registro ${id} eliminado!` };
  }
}

module.exports = MtrTicketServices;
