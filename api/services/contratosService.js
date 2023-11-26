/** Servicios para Control de Contratos
 * @module Servicios_Contratos
 */
const boom = require('@hapi/boom');
//Se debe usar la llamada reservada por sequelize "models"
const { models } = require('../libs/sequelize'); //Usando ORM PARA USAR MODELOS

/** Clase para ejectuar los diferentes servicios de Contratos */
class ContratosServices {
  /** Listar todas las contratos, mediante la función findAll() de sequelize.
   * @see https://sequelize.org/docs/v6/core-concepts/model-querying-finders/#findall
   * @return {Array<Object>} Devuelve un Array de objetos, con todos los datos de cada Contrato desde el modelo de sequelize
   */
  async find() {
    //const answer = await models.Contratos.findAll();
    const answer = await models.Contratos.findAll({
      include: ['empresa', 'planes_mant'],
    });
    return answer;
  }

  /** Crear nuevo contrato, se utiliza la función create() de sequelize
   * @see https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#simple-insert-queries
   * @param {Object} data Objeto con toda la información del contrato a crear
   * @return {Object} Devuelve un mensaje de confirmación con el objeto creado
   */
  async create(data) {
    const newRegister = await models.Contratos.create(data);
    return { message: 'Registro creado con éxito', newRegister };
  }

  /** Busqueda por el id del contrato, mediante la función findByPk() de sequelize
   * @see https://sequelize.org/docs/v6/core-concepts/model-querying-finders/#findbypk
   * @param {string} id Id del contrato a buscar
   * @return {Object} Devuelve el objeto con los datos del contrato encontrado
   */
  async filterId(id) {
    const answer = await models.Contratos.findByPk(id);
    if (!answer) {
      throw boom.notFound('Contrato no encontrado');
    }
    return answer;
  }

  /** Actualiza información del contato, mediante la función update() de sequelize
   * @see https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#simple-update-queries
   * @param {string} id Id del contrato a buscar para su actualización
   * @param {Object} changes Objeto con los datos a actualizar
   * @return {Object} Devuelve el objeto con los datos del registro actualizado
   */
  async update(id, changes) {
    const findReg = await this.filterId(id);
    const dataUpdate = await findReg.update(changes); //Uso directamente la variable de update del modelo
    return { message: 'Datos actualizados', dataUpdate };
  }

  /** Eliminar contrato, mediante la función destroy() de sequelize
   * @see https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#simple-delete-queries
   * @param {string} id Id del contato a eliminar
   * @return {Object} Devuelve mensaje con el id del registro eliminado
   */
  async delete(id) {
    const findReg = await this.filterId(id);
    await findReg.destroy();
    return { message: `Contrato ${id} eliminado!` };
  }
}

module.exports = ContratosServices;
