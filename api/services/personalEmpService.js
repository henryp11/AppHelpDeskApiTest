const boom = require('@hapi/boom');
const { Op } = require('sequelize'); //Para usar operadores de consultas directo desde sequelize
const { models } = require('../libs/sequelize'); //Usando ORM PARA USAR MODELOS

class PersonalEmpServices {
  async find(query) {
    const { limit, offset, rol, idemp } = query;
    const options = {
      where: {},
      order: [['id_emp', 'ASC']],
      include: ['empresa'],
    }; //Para añadir opciones al método del ORM en este caso limit y offset
    //Valido si se envián los query params y los añado al objeto
    if (limit && offset) {
      options.limit = limit;
      options.offset = offset;
    }
    //Valido el rol si es distinto de admin, para que el SQL solo muestre el personal de la empresa que le corresponde al usuario
    //Que realiza la petición. Si es admin por el contrario arrojará la información de todas las empresas
    if (rol && idemp) {
      if (rol !== 'admin') {
        options.where.id_emp = idemp;
      }
    }

    const answer = await models.PersonalEmp.findAll(options);
    return answer;
  }

  //Filtrar un objeto por su id
  async filterId(id) {
    const answer = await models.PersonalEmp.findByPk(id, {
      include: ['empresa'],
    });
    if (!answer) {
      throw boom.notFound('Personal no encontrado');
    }
    return answer;
  }

  //Al crear el personal se vincula dependendiendo con el rol de quien lo cree, que se
  //coloque el id_user del sistema al empleado creado, o si es un supervisor o admin que este
  //seleccione el usuario creado. El perfil vendrá del payload del token así como el sub que contien el id_user
  async create(data, userId, perfil) {
    console.log({ dataEmpService: data });
    if (perfil === 'cliente') {
      const newRegister = await models.PersonalEmp.create({
        ...data,
        id_user: userId,
      });
      return { message: 'Registro creado con éxito', newRegister };
    } else {
      const newRegister = await models.PersonalEmp.create(data);
      return {
        message:
          'Registro creado con éxito, aun no se encuentrá vinculado a un usuario del sistema',
        newRegister,
      };
    }
  }

  async update(id, changes) {
    const findReg = await this.filterId(id);
    const dataUpdate = await findReg.update(changes);
    return { message: 'Datos actualizados', dataUpdate };
  }

  async delete(id) {
    const findReg = await this.filterId(id);
    await findReg.destroy();
    return { message: `Resgistro ${id} eliminado!` };
  }
}

module.exports = PersonalEmpServices;
