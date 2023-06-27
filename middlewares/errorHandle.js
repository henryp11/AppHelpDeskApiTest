function logErrors(err, req, res, next) {
  console.log("1. logErrors");
  console.error(err);
  next(err); // Aquí especifico que es un niddleware de error
}

//Error especifico para 500
//ASI NO SE UTILICE LA FUNCION NEXT SE DEBE COLOCAR COMO PARAMETRO PARA QUE SE DETECTE
//QUE ES UN MIDDLEWARE DE TIPO ERROR, DEBE TENER LOS 4 PARÁMETROS
function errorHandler(err, req, res, next) {
  console.log("2. errorHandler");
  res.status(500).json({
    message: err.message,
    stack: err.stack, //el stack es para saber donde ocurrio el error
  });
}

function boomErrorHandler(err, req, res, next) {
  if (err.isBoom) {
    const { output } = err; //Cuando es un error de boom manda toda la info al atributo output
    //En este caso el codígo de error será dinámico y lo puedo leer desde la propiedad output.statusCode
    // y la información a enviar como respuesta vendra de output.payload
    res.status(output.statusCode).json(output.payload);
  } else {
    next(err); //si no es un error normal continuará por un middleware de tipo de error normal.
  }
}

module.exports = { logErrors, errorHandler, boomErrorHandler };
