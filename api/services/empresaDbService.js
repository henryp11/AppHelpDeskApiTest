const boom = require("@hapi/boom");
const getConnection = require("../libs/postgres"); //Traigo el módulo con la conexión
const pool = require("../libs/postgresPool"); //Usando Pooling
class EmpresasDbServices {
  constructor() {
    this.pool = pool; //Con el objeto pool creo el constructor del servicio
    //Evaluo si hubiera algún error en la conexión
    this.pool.on("error", (err) => {
      console.error(err);
    });
  }

  //Conexión con ORM

  //Conexión con pool
  async find() {
    const query = "SELECT * FROM empresas ORDER BY 1"; //Creo el query directamente
    const allEmpresas = await this.pool.query(query); //llamo el método query de pool
    return allEmpresas.rows; //Retorno el número de filas de la consulta
  }

  //Conexión con CLient
  // async find() {
  //   const client = await getConnection(); //hago la conexión uso await por el async
  //   //una vez conectado ya puedo hacer consultas igualmente con await hasta que lleguen los datos
  //   const allEmpresas = await client.query("SELECT * FROM empresas ORDER BY 1");
  //   return allEmpresas.rows; //Retorno el número de filas de la consulta
  // }
  //Filtrar un objeto por su id
  async filterId(id) {
    return { id };
  }

  async create(data) {
    return data;
  }

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

module.exports = EmpresasDbServices;
