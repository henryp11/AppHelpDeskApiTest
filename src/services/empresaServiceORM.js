const boom = require('@hapi/boom');
const { Op } = require('sequelize'); //Para usar operadores de consultas directo desde sequelize
//const sequelize = require("../libs/sequelize"); //Usando ORM PARA CONSULTAS DIRECTAS
//Se debe usar la llamada reservada por sequelize "models"
const { models } = require('../libs/sequelize'); //Usando ORM PARA USAR MODELOS

/** Clase para ejectuar los diferentes servicios de Empresas */
class EmpresasServicesORM {
  //USANDO EL MODELO DEL ORM sin query`s
  //Conexión con ORM: No se requiere un constructor ya que sequelize usa pool por defecto
  async find(query) {
    const { limit, offset, plan_mant } = query;
    const options = {
      where: {},
      order: [['id_emp', 'ASC']],
      include: 'personal_emp',
    }; //Para añadir opciones al método del ORM en este caso limit y offset
    //Valido si se envián los query params y los añado al objeto
    if (limit && offset) {
      options.limit = limit;
      options.offset = offset;
    }
    //Valido si se quiere filtrar solo las empresa que tienen plan vigente e incluirlos en el where
    if (plan_mant) {
      options.where.plan_mant = plan_mant;
    }

    const allEmpresas = await models.Empresa.findAll(options); //Usando métodos de ORM
    return allEmpresas;
  }

  async filterRuc(query) {
    const { ruc } = query;
    const options = { where: { ruc: ruc } };
    //Se realiza la búsqueda anidada por PK y con anidación a la FK de contratos
    const empresa = await models.Empresa.findAll(options);
    if (!empresa) {
      throw boom.notFound('Empresa no encontrada');
    }
    return empresa;
  }

  async filterId(id) {
    //Se realiza la búsqueda anidada por PK y con anidación a la FK de contratos
    const empresa = await models.Empresa.findByPk(id, {
      include: ['contratos', 'personal_emp'],
    });
    if (!empresa) {
      throw boom.notFound('Empresa no encontrada');
    }
    return empresa;
  }

  async create(data) {
    const newEmpresa = await models.Empresa.create(data);
    return { message: 'Registro creado con éxito', newEmpresa };
  }

  async update(id, changes) {
    //Primero busco con la función ya creada
    const empresa = await this.filterId(id);
    //Ya que la busqueda me devuelve el modelo con el dato requerido
    //Uso directamente la variable de update desde el modelo
    const empresaUpdated = await empresa.update(changes);
    return { message: 'Datos actualizados', empresaUpdated };
  }

  async delete(id) {
    const empresa = await this.filterId(id); //busco registro con la función ya creada
    await empresa.destroy();
    return { message: `Empresa ${id} eliminada!` };
  }

  //USANDO UN QUERY DIRECTO PARA ENVIAR AL ORM
  // async find() {
  //   const query = "SELECT * FROM empresas ORDER BY 1";
  //   //llamo el método query de sequelize ya que tambien permite ejecutar consultas directas
  //   // const [data, metadata] = await sequelize.query(query); //La información que se retorna es un Array
  //   // //El Array del ORM en la primera posición envia los datos y la segunda informació amplia de la consulta
  //   // return { data, metadata };
  //   const [data] = await sequelize.query(query);
  //   //Solo retornbo la data si no necesito la metadata
  //   return data;
  // }

  //Conexión con CLient
  // async find() {
  //   const client = await getConnection(); //hago la conexión uso await por el async
  //   //una vez conectado ya puedo hacer consultas igualmente con await hasta que lleguen los datos
  //   const allEmpresas = await client.query("SELECT * FROM empresas ORDER BY 1");
  //   return allEmpresas.rows; //Retorno el número de filas de la consulta
  // }

  // async update(id, changes) {
  //   //Al estar todo en un array primero obtengo la posición de lo que quiero actualizar
  //   //con findIndex()
  //   const index = this.empresas.findIndex((empresa) => empresa.id === id);
  //   //Evaluo si existe lo que se está buscando, si un index no se encuentra se retorna -1
  //   if (index === -1) {
  //     //throw new Error("Empresa no encontrada"); //Forma estandar de enviar errores
  //     throw boom.notFound("Empresa no encontrada"); //Usando Boom para usar funciones con el nombre del error
  //   }
  //   //Si se encuentra la posición se reemplaza por los cambios,
  //   //se hace spread porque solo se manda un cambio no todo el objeto
  //   this.empresas[index] = { ...this.empresas[index], ...changes };
  //   return this.empresas[index]; //Se retorna el objeto cambiad
  // }

  // async delete(id) {
  //   const index = this.empresas.findIndex((empresa) => empresa.id === id);
  //   //Evaluo si existe lo que se está buscando, si un index no se encuentra se retorna -1
  //   if (index === -1) {
  //     throw boom.notFound("Empresa no encontrada");
  //   }
  //   this.empresas.splice(index, 1); //Con la función splice, Si se encuentra la posición se elimina
  //   return { id }; //Retorno solo como mensaje que registro se elimino por su id
  // }
}

module.exports = EmpresasServicesORM;
