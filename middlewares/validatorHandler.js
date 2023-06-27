//Será un middleware normal
const boom = require("@hapi/boom");

function validatorHandler(schema, property) {
  //Retornaré una función que sea un middleware como que lo "creo"
  //Porque requiero construir middlewares de forma dinámica
  //Por eso como parametros principales se recibe un esquema, se indica donde
  //Encontrar la información y se retornará un middleware para el caso que requiero
  //Para esto utilizaré la propiedad de closure de JavaScript
  return (req, res, next) => {
    //Recojo la info dinamicamente, porque depende de que tipo de petición venga por ejemplo:
    //Si viene de un post= req.body, para get: req.params, de parámetro de ruta: req.query
    const data = req[property];
    //Si viene de joi se usa la función de esquema validate() que contendrá lo que se desea validar
    const { error } = schema.validate(data, { abortEarly: false }); //Devuelve una propiedad por eso puede desestructar

    //Si hay error, lo manejo como un error Boom de request (errores 400) y lo encierro
    //en un next porque si se ejecuta se deberán ejecutar los middleware de errores
    if (error) {
      next(boom.badRequest(error));
    }
    //Si no existe errores continuará los middleware normalmente
    next();
  };
}

module.exports = validatorHandler;
