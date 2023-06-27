const express = require("express");

//Importo las rutas de todos los demas elementos
const clientsRoute = require("./clientesRouter");
const provRoute = require("./proveedRouter");
const empresasRoute = require("./empresasRouter");

function routerApi(app) {
  const mainRouteApi = express.Router();
  //Con .use utilizo la ruta y lo que venga del módulo
  app.use("/api/v1", mainRouteApi);
  mainRouteApi.use("/clientes", clientsRoute);
  mainRouteApi.use("/prov", provRoute);
  mainRouteApi.use("/empresas", empresasRoute);
}

module.exports = routerApi;
