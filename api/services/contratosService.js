const boom = require("@hapi/boom");
//Se debe usar la llamada reservada por sequelize "models"
const { models } = require("../libs/sequelize"); //Usando ORM PARA USAR MODELOS

class ContratosServices {
  async find() {
    //const answer = await models.Contratos.findAll();
    const answer = await models.Contratos.findAll({ include: "empresa" });
    return answer;
  }

  async create(data) {
    const newRegister = await models.Contratos.create(data);
    return { message: "Registro creado con éxito", newRegister };
  }

  async filterId(id) {
    const answer = await models.Contratos.findByPk(id);
    if (!answer) {
      throw boom.notFound("Contrato no encontrado");
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
    return { message: `Contrato ${id} eliminado!` };
  }
}

module.exports = ContratosServices;
