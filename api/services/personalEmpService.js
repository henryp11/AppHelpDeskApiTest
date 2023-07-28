const boom = require("@hapi/boom");
const { Op } = require("sequelize"); //Para usar operadores de consultas directo desde sequelize
const { models } = require("../libs/sequelize"); //Usando ORM PARA USAR MODELOS

class PersonalEmpServices {
  async find(query) {
    const { limit, offset } = query;
    const options = { where: {}, order: [["id_per", "ASC"]] }; //Para añadir opciones al método del ORM en este caso limit y offset
    //Valido si se envián los query params y los añado al objeto
    if (limit && offset) {
      options.limit = limit;
      options.offset = offset;
    }
    const answer = await models.PersonalEmp.findAll(options);
    return answer;
  }

  //Filtrar un objeto por su id
  async filterId(id) {
    const answer = await models.PersonalEmp.findByPk(id);
    if (!answer) {
      throw boom.notFound("Personal no encontrado");
    }
    return answer;
  }
  async create(data, userId) {
    const newRegister = await models.PersonalEmp.create({
      ...data,
      id_user: userId,
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
    return { message: `Resgistro ${id} eliminado!` };
  }
}

module.exports = PersonalEmpServices;
