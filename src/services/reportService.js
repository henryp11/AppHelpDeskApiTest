const boom = require('@hapi/boom');
const { Op } = require('sequelize'); //Para usar operadores de consultas directo desde sequelize
const { models } = require('../libs/sequelize'); //Usando ORM PARA USAR MODELOS

class ReportServices {
  async find(query) {
    //Se realziará filtrados por empresa, cliente, fechas y operadores
    //Solo de tickets finalizados y con todo el detalle de solicitudes y controles de tiempo
    const { rol, idemp, idclient, dateini, datefin, filter } = query;
    const estatusEspecifico = ['finalizado'];
    //Opciones para reporte resumido. Tabla principal MTR_TICKETS
    const options = {
      where: { estatus: estatusEspecifico },
      order: [['id_ticket']],
      include: [
        { association: 'personal_emp', include: 'empresa' },
        { association: 'det_tickets', include: 'agentes_sop' },
        { association: 'det_tickets', include: 'control_tickets' },
      ],
    }; //Para añadir opciones al método del ORM

    if (idemp) {
      options.where.id_emp = idemp;
      if (rol === 'cliente') {
        options.where.id_cliente = idclient;
      }
    }

    if (idclient) {
      options.where.id_cliente = idclient;
    }

    // if (dateini && datefin) {
    //   options.where.fecha_reg = {
    //     [Op.between]: [dateini, datefin],
    //   };
    // }

    if (filter) {
      switch (filter) {
        case 'mayor':
          options.where.fecha_reg = {
            [Op.gt]: dateini,
          };
          break;
        case 'mayorigual':
          options.where.fecha_reg = {
            [Op.gte]: dateini,
          };
          break;
        case 'menor':
          options.where.fecha_reg = {
            [Op.lt]: dateini,
          };
          break;
        case 'menorigual':
          options.where.fecha_reg = {
            [Op.lte]: dateini,
          };
          break;
        case 'entre':
          options.where.fecha_reg = {
            [Op.between]: [dateini, datefin],
          };
          break;

        default:
          options.where.fecha_reg = dateini;
          // options.where.fecha_reg = {
          //   [Op.between]: [`${dateini} 00:00:00`, `${datefin} 23:59:59`],
          // };
          break;
      }
    }

    const answer = await models.MtrTickets.findAll(options);
    return answer;
  }
  async findSolicitudes(query) {
    //Se realizará filtrados por empresa, cliente, fechas y operadores (Utilizando el include hacia MTR_TICKETS)
    //Solo de tickets finalizados y con todo el detalle de solicitudes y controles de tiempo
    const { rol, idemp, idclient, dateini, datefin, filter } = query;
    const estatusEspecifico = ['finalizado'];
    //Opciones para reporte resumido. Tabla principal DET_TICKETS
    const options = {
      where: { '$mtr_tickets.estatus$': estatusEspecifico },
      order: [
        ['id_ticket', 'ASC'],
        ['id_solicitud', 'ASC'],
      ],
      include: [
        {
          association: 'mtr_tickets',
          include: [{ association: 'personal_emp', include: 'empresa' }],
        },
        'agentes_sop',
        'control_tickets',
      ],
    }; //Para añadir opciones al método del ORM

    if (idemp) {
      // options.include[0].where.id_emp = idemp;
      options.where = {
        ...options.where,
        '$mtr_tickets.id_emp$': idemp,
      };
      if (rol === 'cliente') {
        // options.include[0].where.id_cliente = idclient;
        options.where = {
          ...options.where,
          '$mtr_tickets.id_cliente$': idclient,
        };
      }
    }

    if (idclient) {
      // options.include[0].where.id_cliente = idclient;
      options.where = {
        ...options.where,
        '$mtr_tickets.id_cliente$': idclient,
      };
    }

    // if (dateini && datefin) {
    //   options.where.fecha_reg = {
    //     [Op.between]: [dateini, datefin],
    //   };
    // }

    if (filter) {
      switch (filter) {
        case 'mayor':
          options.where = {
            ...options.where,
            '$mtr_tickets.fecha_reg$': {
              [Op.gt]: dateini,
            },
          };
          break;
        case 'mayorigual':
          options.where = {
            ...options.where,
            '$mtr_tickets.fecha_reg$': {
              [Op.gte]: dateini,
            },
          };
          break;
        case 'menor':
          options.where = {
            ...options.where,
            '$mtr_tickets.fecha_reg$': {
              [Op.lt]: dateini,
            },
          };
          break;
        case 'menorigual':
          options.where = {
            ...options.where,
            '$mtr_tickets.fecha_reg$': {
              [Op.lte]: dateini,
            },
          };
          break;
        case 'entre':
          options.where = {
            ...options.where,
            '$mtr_tickets.fecha_reg$': {
              [Op.between]: [dateini, datefin],
            },
          };
          break;

        default:
          options.where = {
            ...options.where,
            '$mtr_tickets.fecha_reg$': dateini,
          };
          // options.where.fecha_reg = {
          //   [Op.between]: [`${dateini} 00:00:00`, `${datefin} 23:59:59`],
          // };
          break;
      }
    }

    const answer = await models.DetTickets.findAll(options);
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
}

module.exports = ReportServices;
