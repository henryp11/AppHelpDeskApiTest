const boom = require('@hapi/boom');
const { Op } = require('sequelize'); //Para usar operadores de consultas directo desde sequelize
const { models } = require('../libs/sequelize'); //Usando ORM PARA USAR MODELOS

class MtrTicketServices {
  async find(query) {
    const { limit, offset, rol, idemp, idclient, tracking } = query;
    const estatusEspecifico = ['solicitado', 'proceso', 'detenido'];
    const options = {
      where: {},
      order: [['fecha_reg', 'DESC']],
      include: [
        { association: 'personal_emp', include: 'empresa' },
        'det_tickets',
        'categorias_sop',
      ],
    }; //Para añadir opciones al método del ORM en este caso limit y offset
    //Valido si se envián los query params y los añado al objeto
    if (limit && offset) {
      options.limit = limit;
      options.offset = offset;
    }

    //Valido el rol si es distinto de admin, para que el SQL solo muestre los tickets de la empresa a la que pertenece el usuario
    // Si es admin por el contrario se debe mostrar todos los tickets para todas las empresas
    if (rol && idemp) {
      if (rol === 'supervisor') {
        options.where.id_emp = idemp;
        if (tracking === 'true') {
          //PARA TRACKING QUITO LOS ANULADOS Y FINALIZADOS.
          // options.where.id_emp = idemp;
          options.where.estatus = estatusEspecifico;
        }
      } else if (rol === 'cliente') {
        options.where.id_emp = idemp;
        options.where.id_cliente = idclient;
        if (tracking === 'true') {
          // options.where.id_emp = idemp;
          // options.where.id_cliente = idclient;
          options.where.estatus = estatusEspecifico;
        }
      } else if (rol === 'agente') {
        // options.where.id_cliente = idclient;
        if (tracking === 'true') {
          options.where.estatus = estatusEspecifico;
        }
      }
    }

    const answer = await models.MtrTickets.findAll(options);
    return answer;
  }

  //Esta función retorna el número de tickets consultados, el cual se usará para paginación y calculo de offsets
  async counterReg(query) {
    const { rol, idemp, idclient, tracking } = query;
    const estatusEspecifico = ['solicitado', 'proceso', 'detenido'];
    const options = {
      where: {},
    };

    //Valido el rol si es distinto de admin, para que el SQL solo muestre los tickets de la empresa a la que pertenece el usuario
    // Si es admin por el contrario se debe mostrar todos los tickets para todas las empresas
    if (rol && idemp) {
      if (rol === 'supervisor') {
        options.where.id_emp = idemp;
        if (tracking === 'true') {
          //PARA TRACKING QUITO LOS ANULADOS Y FINALIZADOS.
          options.where.estatus = estatusEspecifico;
        }
      } else if (rol === 'cliente') {
        options.where.id_emp = idemp;
        options.where.id_cliente = idclient;
        if (tracking === 'true') {
          options.where.estatus = estatusEspecifico;
        }
      } else if (rol === 'agente') {
        if (tracking === 'true') {
          options.where.estatus = estatusEspecifico;
        }
      }
    }

    const answer = await models.MtrTickets.count(options);
    return answer;
  }

  //Filtrar ticket por su id, se asocia con data empresa y detalle del ticket(solicitudes)
  async filterId(id) {
    const options = {
      include: [
        { association: 'personal_emp', include: 'empresa' },
        { association: 'det_tickets', include: 'agentes_sop' },
        'categorias_sop',
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

  async create(data, clientId, idEmp, perfil) {
    //Si el perfil es 'cliente' es un ticket normal, donde el id_cliente e id_emp se obtienen del Payload del token JWT
    //Caso contrario si es agente o administrador, se entiende que es un ticket extemporaneo ingresado manualmente por un agente o admin,
    //y este es quien envía el dato de la empresa a la cual está ingresando el ticket.
    const dataFinalTicket =
      perfil === 'cliente'
        ? {
            ...data,
            id_cliente: clientId,
            id_emp: idEmp,
          }
        : {
            ...data,
          };
    const newRegister = await models.MtrTickets.create(dataFinalTicket);
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
