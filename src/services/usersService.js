const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const { models } = require('../libs/sequelize');

/** Clase para ejectuar los diferentes servicios de Usuarios */
class UsersServices {
  async find() {
    const answer = await models.Users.findAll({
      include: [{ association: 'personalEmp', include: 'empresa' }],
    });
    //const answer = await models.Contratos.findAll({ include: "empresa" });
    return answer;
  }

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

  async filterId(id) {
    //Traigo las asociaciones del usuario, en dos niveles de anidamiento
    const answer = await models.Users.findByPk(id, {
      include: [
        { association: 'personalEmp', include: 'empresa' },
        'agentesSop',
      ],
    });
    if (!answer) {
      throw boom.notFound('Usuario no encontrado :(');
    }
    return answer;
  }

  //Buscar usuarios por email (se pone el parámetro "mail" porque así se llama la columna en la BD),
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

  async update(id, changes) {
    const findReg = await this.filterId(id);
    const dataUpdate = await findReg.update(changes); //Uso directamente la variable de update del modelo
    return { message: 'Datos actualizados', dataUpdate };
  }

  async delete(id) {
    const findReg = await this.filterId(id);
    await findReg.destroy();
    return { message: `Usuario ${id} eliminado!` };
  }
}

module.exports = UsersServices;
