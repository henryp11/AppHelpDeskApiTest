/** Servicios de usuarios
 * @module Servicios_Usuarios
 */
/** Requiere la dependencia boom para mostrar mensajes personalizados tanto de éxito como de errores */
const boom = require('@hapi/boom');
/** Requiere la dependencia bcrypt para encriptar datos con hash*/
const bcrypt = require('bcrypt');
//Se debe usar la llamada reservada por sequelize "models" desde la libreria de conexión
const { models } = require('../libs/sequelize');

/** Clase para ejectuar los diferentes servicios de Usuarios */
class UsersServices {
  /** Listar todos los usuarios, mediante la función findAll() de sequelize
   * @see https://sequelize.org/docs/v6/core-concepts/model-querying-finders/#findall
   * @return {Array<Object>} Devuelve un Array de objetos, con todos los datos de cada usuario desde el modelo de sequelize
   */
  async find() {
    const answer = await models.Users.findAll({
      include: [{ association: 'personalEmp', include: 'empresa' }],
    });
    //const answer = await models.Contratos.findAll({ include: "empresa" });
    return answer;
  }

  /** Crear un nuevo usuario, se utiliza a bcrypt para aplicar un hash a la contraseña y la función create() de sequelize
   * @see https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#simple-insert-queries
   * @param {Object} data Objeto con toda la información del usuario a crear
   * @return {Object} Devuelve un mensaje de confirmación con el objeto creado
   */
  async create(data) {
    const hash = await bcrypt.hash(data.password, 10); //Campo del objeto a encriptar
    const newRegister = await models.Users.create({
      ...data,
      password: hash,
    });
    // delete newRegister.password; //Eliminar normalmente un campo con JS
    delete newRegister.dataValues.password; //Eliminar el campo para Sequelize depende del ORM
    return { message: 'Registro creado con éxito', newRegister };
  }

  /** Busqueda por el id de usuario, mediante la función findByPk() de sequelize
   * @see https://sequelize.org/docs/v6/core-concepts/model-querying-finders/#findbypk
   * @param {string} id Id del usuario a buscar
   * @return {Object} Devuelve el objeto con los datos del usuario encontrado
   */
  async filterId(id) {
    //Traigo las asociaciones del usuario, en dos niveles de anidamiento
    const answer = await models.Users.findByPk(id, {
      include: [{ association: 'personalEmp', include: 'empresa' }],
    });
    if (!answer) {
      throw boom.notFound('Usuario no encontrado :(');
    }
    return answer;
  }

  //Buscar usuarios por email (se pone el parámetro "mail" porque así se llama la columna en la BD),
  /** Servicio para buscar a los usuarios por su email, utiliza la función findOne() de sequelize
   * @see https://sequelize.org/docs/v6/core-concepts/model-querying-finders/#findone
   * @param {string} mail Correo a buscar en BD
   * @return {string} Si encontró al usuario retornará su id_user
   */
  async findByEmail(mail) {
    //con findOne indico que traiga el primero que encuentre
    const answer = await models.Users.findOne({ where: { mail } });
    //Una vez encontrado el registro lo vuelvo a buscar por su id_user que me devuelva
    //las asociaciones anidadas con los datos del cliente y la empresa asociada
    if (!answer) {
      throw boom.unauthorized();
    }
    const answerInclude = await this.filterId(answer.id_user);
    return answerInclude;
  }

  /** Actualiza información del usuario, mediante la función update() de sequelize
   * @see https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#simple-update-queries
   * @param {string} id Id del usuario a buscar para su actualización
   * @param {Object} changes Objeto con los datos a actualizar
   * @return {Object} Devuelve el objeto con los datos del registro actualizado
   */
  async update(id, changes) {
    const findReg = await this.filterId(id);
    const dataUpdate = await findReg.update(changes); //Uso directamente la variable de update del modelo
    return { message: 'Datos actualizados', dataUpdate };
  }

  /** Eliminar un usuario, mediante la función destroy() de sequelize
   * @see https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#simple-delete-queries
   * @param {string} id Id del usuario a eliminar
   * @return {Object} Devuelve mensaje con el id del usuario eliminado
   */
  async delete(id) {
    const findReg = await this.filterId(id);
    await findReg.destroy();
    return { message: `Usuario ${id} eliminado!` };
  }
}

module.exports = UsersServices;
