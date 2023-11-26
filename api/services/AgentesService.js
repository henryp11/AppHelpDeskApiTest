/** Servicios para Control de Contratos
 * @module Servicios_Agentes_Soporte
 */

const boom = require('@hapi/boom');
//Se debe usar la llamada reservada por sequelize "models"
const { models } = require('../libs/sequelize'); //Usando ORM PARA USAR MODELOS

/** Clase para ejectuar los diferentes servicios para Agentes de soporte */
class AgentesServices {
  /** Listar todos los Agentes de soporte, mediante la función findAll() de sequelize.
   * @see https://sequelize.org/docs/v6/core-concepts/model-querying-finders/#findall
   * @return {Array<Object>} Devuelve un Array de objetos, con todos los datos de cada agente desde el modelo de sequelize
   */
  async find() {
    const answer = await models.Agentes.findAll();
    return answer;
  }

  /** Crear nuevo Agente, se utiliza la función create() de sequelize
   * @see https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#simple-insert-queries
   * @param {Object} data Objeto con toda la información del agente a crear
   * @return {Object} Devuelve un mensaje de confirmación con el objeto creado
   */
  async create(data) {
    const newRegister = await models.Agentes.create(data);
    return { message: 'Registro creado con éxito', newRegister };
  }

  /** Busqueda por el id del agente, mediante la función findByPk() de sequelize
   * @see https://sequelize.org/docs/v6/core-concepts/model-querying-finders/#findbypk
   * @param {string} id Id del agente a buscar
   * @return {Object} Devuelve el objeto con los datos del agente encontrado
   */
  async filterId(id) {
    const answer = await models.Agentes.findByPk(id);
    if (!answer) {
      throw boom.notFound('Agente Soporte no encontrado');
    }
    return answer;
  }

  /** Actualiza información del agente, mediante la función update() de sequelize
   * @see https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#simple-update-queries
   * @param {string} id Id del agente a buscar para su actualización
   * @param {Object} changes Objeto con los datos a actualizar
   * @return {Object} Devuelve el objeto con los datos del registro actualizado
   */
  async update(id, changes) {
    const findReg = await this.filterId(id);
    const dataUpdate = await findReg.update(changes);
    return { message: 'Datos actualizados', dataUpdate };
  }

  /** Eliminar Agente, mediante la función destroy() de sequelize
   * @see https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#simple-delete-queries
   * @param {string} id Id del contato a eliminar
   * @return {Object} Devuelve mensaje con el id del registro eliminado
   */
  async delete(id) {
    const findReg = await this.filterId(id);
    await findReg.destroy();
    return { message: `Agente ${id} eliminado!` };
  }
}

module.exports = AgentesServices;
