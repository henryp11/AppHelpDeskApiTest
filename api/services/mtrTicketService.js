const boom = require("@hapi/boom");
const { Op } = require("sequelize"); //Para usar operadores de consultas directo desde sequelize
const { models } = require("../libs/sequelize"); //Usando ORM PARA USAR MODELOS

class MtrTicketServices {
  async find(query) {
    const { limit, offset } = query;
    const options = { where: {}, order: [["id_ticket", "ASC"]] }; //Para añadir opciones al método del ORM en este caso limit y offset
    //Valido si se envián los query params y los añado al objeto
    if (limit && offset) {
      options.limit = limit;
      options.offset = offset;
    }
    const answer = await models.MtrTickets.findAll(options);
    return answer;
  }

  //Filtrar un objeto por su id
  async filterId(id) {
    const answer = await models.MtrTickets.findByPk(id);
    if (!answer) {
      throw boom.notFound("Ticket no encontrado");
    }
    return answer;
  }

  //Para mostrar todos los tickets de un usuario por token
  async findByUser(userId) {
    const tickets = await models.MtrTickets.findAll({
      //El simbolo "$" permite a sequelize realizar una consulta anidada en base a la asociación
      //que deseo en este caso busco el id_user anidado en el personal_emp y su asociación de users
      where: {
        "$personal_emp.users.id_user$": userId,
      },
      include: [{ association: "personal_emp", include: ["users"] }],
    });
    return tickets;
  }

  async create(data, clientId) {
    const newRegister = await models.MtrTickets.create({
      ...data,
      id_cliente: clientId,
    });
    return { message: "Registro creado con éxito", newRegister };
  }

  async update(id, changes) {
    const findReg = await this.filterId(id);
    const dataUpdate = await findReg.update(changes);
    return { message: "Datos actualizados", dataUpdate };
  }

  async delete(id) {
    const findReg = await this.filterId(id);
    await findReg.destroy();
    return { message: `Registro ${id} eliminado!` };
  }
}

module.exports = MtrTicketServices;
