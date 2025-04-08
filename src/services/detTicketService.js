const boom = require('@hapi/boom');
const { Op } = require('sequelize'); //Para usar operadores de consultas directo desde sequelize
const { models } = require('../libs/sequelize'); //Usando ORM PARA USAR MODELOS
const sequelize = require('../libs/sequelize'); //Usando ORM Para usar queries directos
const ControlTicketServices = require('./controlTicketService');
const serviceControl = new ControlTicketServices(); //Creo el objeto para traer servicios de controles de solicitudes

class DetTicketServices {
  async find(query) {
    const { limit, offset, tracking, assigment, agent } = query;
    //Estado para mostrar todas las solicitudes de soporte exceptuando finalizadas y anuladas
    //Para usarlo al momento de ver los tickets asignados a los agentes (por agente) o un general (administrador)
    const estatusEspecifico = [
      'pendiente',
      'asignado',
      'proceso',
      'pausado',
      'reasignado',
    ];
    //Para ver las solicitudes terminadas por agente, a usarse en la pantalla de 'Historial de Tickets atendidos'
    const estatusHistorico = ['finalizado'];
    const estatusAssign = ['pendiente'];
    const options = {
      where: {},
      order: [
        ['id_ticket', 'ASC'],
        ['id_solicitud', 'ASC'],
      ],
      include: [
        {
          association: 'mtr_tickets',
          include: [
            { association: 'personal_emp', include: 'empresa' },
            'categorias_sop',
          ],
        },
        'agentes_sop',
      ],
    }; //Para añadir opciones al método del ORM en este caso limit y offset
    //Valido si se envián los query params y los añado al objeto
    if (limit && offset) {
      options.limit = limit;
      options.offset = offset;
    }

    //Posibles filtros para tracking: (Tracking activa para filtrar por estatus Especifico)
    // tracking: Muestra todos los estados excepto finalizado y anulado
    // assigment: Muestra solo los pendientes
    if (tracking === 'true') {
      //Si se envía Assigment=true es para ver los tickets pendientes de asignar.
      if (assigment === 'true') {
        options.where.estatus = estatusAssign;
      } else {
        options.where.estatus = estatusEspecifico;
      }
    }

    //Muestra las solicitudes ya asignadas a un agente con los estados específicos.
    if (tracking === 'true' && agent !== '') {
      options.where.estatus = estatusEspecifico;
      options.where.agente_asig = agent;
    }

    //Muestra las solicitudes atendidas (histórico) por agente.
    if (tracking === 'false' && agent !== '') {
      options.include.push({ association: 'control_tickets' });
      options.where.estatus = estatusHistorico;
      options.where.agente_asig = agent;
      options.order = [
        ['id_ticket', 'DESC'],
        ['id_solicitud', 'DESC'],
      ];
    }

    const answer = await models.DetTickets.findAll(options);
    return answer;
  }

  //Filtrar un objeto por su id
  async filterId(id) {
    const answer = await models.DetTickets.findByPk(id);
    if (!answer) {
      throw boom.notFound('Solicitud no encontrada');
    }
    return answer;
  }
  //Se utiliza dentro del Update, pero tambien como ruta independiente para mostrar las solicitudes
  //Al momento de crearlas
  async filterIdTicketIdSolicitud(id_ticket, id_solicitud) {
    const options = {
      where: {},
      include: [
        {
          association: 'mtr_tickets',
          include: [
            { association: 'personal_emp', include: 'empresa' },
            'categorias_sop',
          ],
        },
      ],
    };

    try {
      //Se busca controles para el ticket y la solicitud especificada desde los servicios de control
      const regFind = await serviceControl.filterByTicketSolicitud(
        id_ticket,
        id_solicitud
      );
      console.log({ regFind: regFind });

      //Si se encontró registros de control, en la consulta usando los servicios de controles,
      //envío en el where el ticket y solicitud especificos para ver sus controles
      //mediante la consulta de sequelize por anidamiento. Y se incluye la asociación con la tabla de control_tickets
      if (regFind.length > 0) {
        options.where = {
          id_ticket: id_ticket,
          id_solicitud: id_solicitud,
          '$control_tickets.id_ticket$': id_ticket,
          '$control_tickets.id_solicitud$': id_solicitud,
        };

        options.include.push({ association: 'control_tickets' });
      } else {
        //Si no se encontro los controles se realiza la busqueda solo a nivel de detalle de solicitudes
        //Sin Control de tickets.
        options.where = {
          id_ticket: id_ticket,
          id_solicitud: id_solicitud,
        };
      }

      const answer = await models.DetTickets.findAll(options);
      if (!answer) {
        throw boom.notFound('Ticket o Solicitud no encontrado');
      }
      return answer;
    } catch (error) {
      console.log(`Error desde servicio de Control Ticket: ${error}`);
    }
  }

  async filterAllSolByTicket(id_ticket) {
    const options = {
      where: {
        id_ticket: id_ticket,
      },
    };

    const answer = await models.DetTickets.findAll(options);
    if (!answer) {
      throw boom.notFound('Ticket no encontrado');
    }
    return answer;
  }

  //Para mostrar todos los tickets de un usuario por token
  async findByUser(userId) {
    const tickets = await models.DetTickets.findAll({
      //El simbolo "$" permite a sequelize realizar una consulta anidada en base a la asociación
      //que deseo en este caso busco el id_user anidado en el personal_emp y su asociación de users
      where: {
        '$personal_emp.users.id_user$': userId,
      },
      include: [{ association: 'personal_emp', include: ['users'] }],
    });
    return tickets;
  }

  async create(data, ticketId) {
    const newRegister = await models.DetTickets.create({
      ...data,
      id_ticket: ticketId,
    });
    return { message: 'Registro creado con éxito', newRegister };
  }

  async update(id_ticket, id_solicitud, changes) {
    // const findReg = await this.filterId(id);
    const findReg = await this.filterIdTicketIdSolicitud(
      id_ticket,
      id_solicitud
    );
    //La función de búsqueda es findAll mediante un query para hallar el registro
    //y este devuelve un Array, por ende ingreso a esa posición para aplicar
    //la función de update de sequelize ya que estas se aplican solo a objetos
    const dataUpdate = await findReg[0].update(changes);
    return { message: 'Datos actualizados', dataUpdate };
  }

  //Delete simple por id de solicitud
  async delete(id) {
    const findReg = await this.filterId(id);
    await findReg.destroy();
    return { message: `Registro ${id} eliminado!` };
  }

  //Delete De todos las solicitudes de un ticket con query directo ya que
  //el método destroy() solo elimina la primera instancia que encuentre así tenga varios registros que eliminar (no funciono ni colocando el where dentro de la función destroy como menciona la documentación),
  // en este caso necesito eliminar todas las solicitudes de un ticket por eso se usa un DELETE por query
  // Considerar este caso cuando se deba cambiar de BASE DE DATOS.
  async deleteAllSolic(id_ticket) {
    //const findReg = await this.filterAllSolByTicket(id_ticket);
    const query = `DELETE from det_tickets where id_ticket=${id_ticket}`;
    const metadata = await sequelize.query(query);
    console.log({ metadata: metadata });
    return { message: `Solicitudes del ticket ${id_ticket} eliminadas!` };
  }
}

module.exports = DetTicketServices;
