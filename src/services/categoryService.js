const boom = require('@hapi/boom');
const { Op } = require('sequelize'); //Para usar operadores de consultas directo desde sequelize
const { models } = require('../libs/sequelize'); //Usando ORM PARA USAR MODELOS

class CategoryServices {
  async find(query) {
    const { limit, offset } = query;
    const options = { where: {}, order: [['id_cat', 'ASC']] }; //Para añadir opciones al método del ORM en este caso limit y offset
    //Valido si se envián los query params y los añado al objeto
    if (limit && offset) {
      options.limit = limit;
      options.offset = offset;
    }
    const answer = await models.Categories.findAll(options);
    return answer;
  }

  //Filtrar un objeto por su id
  async filterId(id) {
    const answer = await models.Categories.findByPk(id);
    if (!answer) {
      throw boom.notFound('Categoría no encontrada');
    }
    return answer;
  }

  async create(data) {
    const newRegister = await models.Categories.create(data);
    return { message: 'Registro creado con éxito', newRegister };
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

module.exports = CategoryServices;
