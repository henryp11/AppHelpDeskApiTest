const boom = require('@hapi/boom');
const { Op } = require('sequelize'); //Para usar operadores de consultas directo desde sequelize
const { models } = require('../libs/sequelize'); //Usando ORM PARA USAR MODELOS

class DetTicketServices {
  async find(query) {
    const { limit, offset } = query;
    const options = { where: {}, order: [['id_ticket', 'ASC']] }; //Para añadir opciones al método del ORM en este caso limit y offset
    //Valido si se envián los query params y los añado al objeto
    if (limit && offset) {
      options.limit = limit;
      options.offset = offset;
    }
    const answer = await models.DetTickets.findAll(options);
    return answer;
  }

  //Filtrar un objeto por su id
  async filterId(id) {
    const answer = await models.DetTickets.findByPk(id);
    if (!answer) {
      throw boom.notFound('Solcitud no encontrada');
    }
    return answer;
  }

  async filterIdTicketIdSolicitud(id_ticket, id_solicitud) {
    const options = {
      where: {
        id_ticket: id_ticket,
        id_solicitud: id_solicitud,
      },
    };

    const answer = await models.DetTickets.findAll(options);
    if (!answer) {
      throw boom.notFound('Ticket o Solicitud no encontrado');
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

  async delete(id) {
    const findReg = await this.filterId(id);
    await findReg.destroy();
    return { message: `Registro ${id} eliminado!` };
  }
}

module.exports = DetTicketServices;
