const boom = require("@hapi/boom");
//Se debe usar la llamada reservada por sequelize "models"
const { models } = require("../libs/sequelize"); //Usando ORM PARA USAR MODELOS

class AgentesServices {
  async find() {
    const answer = await models.Agentes.findAll();
    return answer;
  }

  async create(data) {
    const newRegister = await models.Agentes.create(data);
    return { message: "Registro creado con éxito", newRegister };
  }

  async filterId(id) {
    const answer = await models.Agentes.findByPk(id);
    if (!answer) {
      throw boom.notFound("Agente Soporte no encontrado");
    }
    return answer;
  }

  async update(id, changes) {
    const findReg = await this.filterId(id);
    const dataUpdate = await findReg.update(changes); //Uso directamente la variable de update del modelo
    return { message: "Datos actualizados", dataUpdate };
  }

  async delete(id) {
    const findReg = await this.filterId(id);
    await findReg.destroy();
    return { message: `Agente ${id} eliminado!` };
  }
}

module.exports = AgentesServices;
