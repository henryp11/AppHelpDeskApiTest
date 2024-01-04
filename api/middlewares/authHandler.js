const boom = require('@hapi/boom');
const { config } = require('../../config/config');

function checkApiKey(req, res, next) {
  const apiKey = req.headers['api'];
  if (apiKey === config.apiKey) {
    next();
  } else {
    next(boom.unauthorized());
  }
}

function checkAdminRole(req, res, next) {
  //Como el dato del rol me llegará en el payload extraeré ese valor de la petición
  console.log(req.user);
  const user = req.user;
  if (user.perfil === 'admin') {
    next();
  } else {
    next(boom.forbidden());
  }
}

//Scope para retornar middleware
function checkRoles(...roles) {
  //Los tres puntos automaticamente transformarán en array lo que envíe
  return (req, res, next) => {
    const user = req.user;
    //Se recibe un listado de roles en un array, y se buscar el rol que requiero con include
    if (roles.includes(user.perfil)) {
      next();
    } else {
      next(boom.forbidden());
    }
  };
}

module.exports = { checkApiKey, checkAdminRole, checkRoles };
