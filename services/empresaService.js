//Aqui definimos toda la lógica a nivel transacional que tendrán los datos
//Es decir la gestion de los regustros en este caso las empresas

const { faker } = require("@faker-js/faker");
const boom = require("@hapi/boom"); //Libreria para control de Status Code
class EmpresasServices {
  //Para el objeto que se creará genero su constructor
  constructor() {
    this.empresas = []; //Array para guardar los registros en este caso las empresas
    this.generate(); //Inicializo la funicón que genere las empresas o las traiga de cualquer repo o BD
  }

  //Ahora acá hago la generación de los datos llenando el atributo del constructor
  generate() {
    const limit = 10;
    for (let i = 0; i < limit; i++) {
      this.empresas.push({
        id: faker.string.uuid(),
        name: faker.company.name(),
        descrip: faker.company.buzzPhrase(),
        isBlock: faker.datatype.boolean(),
      });
    }
  }
  //Con este método solo retorno el array obtenido para llamarlo en el route
  find() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.empresas);
      }, 2000);
    });
  }
  //Filtrar un objeto por su id
  async filterId(id) {
    //Generando error a proposito
    // const noExisto = this.getTotales();
    const empresaFind = this.empresas.find((empresa) => empresa.id === id);
    if (!empresaFind) {
      throw boom.notFound("Empresa no encontrada");
    }
    if (empresaFind.isBlock) {
      throw boom.conflict("Empresa Bloqueada no la puede ver");
    }
    return empresaFind;
  }

  async create(data) {
    const newEmpresa = {
      id: faker.string.uuid(),
      ...data,
    };
    this.empresas.push(newEmpresa);
    return newEmpresa; //Normalmente se retorna el dato creado como respuesta
  }

  async update(id, changes) {
    //Al estar todo en un array primero obtengo la posición de lo que quiero actualizar
    //con findIndex()
    const index = this.empresas.findIndex((empresa) => empresa.id === id);
    //Evaluo si existe lo que se está buscando, si un index no se encuentra se retorna -1
    if (index === -1) {
      //throw new Error("Empresa no encontrada"); //Forma estandar de enviar errores
      throw boom.notFound("Empresa no encontrada"); //Usando Boom para usar funciones con el nombre del error
    }
    //Si se encuentra la posición se reemplaza por los cambios,
    //se hace spread porque solo se manda un cambio no todo el objeto
    this.empresas[index] = { ...this.empresas[index], ...changes };
    return this.empresas[index]; //Se retorna el objeto cambiad
  }

  async delete(id) {
    const index = this.empresas.findIndex((empresa) => empresa.id === id);
    //Evaluo si existe lo que se está buscando, si un index no se encuentra se retorna -1
    if (index === -1) {
      throw boom.notFound("Empresa no encontrada");
    }
    this.empresas.splice(index, 1); //Con la función splice, Si se encuentra la posición se elimina
    return { id }; //Retorno solo como mensaje que registro se elimino por su id
  }
}

module.exports = EmpresasServices;
