const express = require('express');

//Importo las rutas de todos los demas elementos
const clientsRoute = require('./clientesRouter');
const provRoute = require('./proveedRouter');
const empresasRoute = require('./empresasRouter');
const empresasDbRoute = require('./empresasDbRouter');
const empresasOrmRoute = require('./empresasOrmRouter');
const contratosRouter = require('./contratosRouter');
const usersRouter = require('./usersRouter');
const PersonalEmp = require('./personalEmpRouter');
const tickets = require('./mtrTicketsRouter');
const detTickets = require('./detTicketsRouter');
const controlTickets = require('./controlTicketsRouter');
const ticketsByClient = require('./ticketsClientRouter');
const authRouter = require('./authRouter');
const planesRouter = require('./planesRouter');
const agentesRouter = require('./agentesRouter');
const reports = require('./reportsRouter');

function routerApi(app) {
  const mainRouteApi = express.Router();
  //Con .use utilizo la ruta y lo que venga del módulo
  app.use('/api/v1', mainRouteApi);
  mainRouteApi.use('/clientes', clientsRoute); //test
  mainRouteApi.use('/prov', provRoute); //test
  mainRouteApi.use('/empresas', empresasRoute); //test
  mainRouteApi.use('/empresasdb', empresasDbRoute); //test
  mainRouteApi.use('/empresasorm', empresasOrmRoute); // Servicios de Empresas
  mainRouteApi.use('/contratos', contratosRouter); // Servicios de Contratos
  mainRouteApi.use('/users', usersRouter); //Servicios de usuarios
  mainRouteApi.use('/personal-empresa', PersonalEmp); //Servicios Personal en Empresas
  mainRouteApi.use('/tickets', tickets); //Servicios de tickets
  mainRouteApi.use('/detalle-tickets', detTickets); //Servicios de solicitudes
  mainRouteApi.use('/control-tickets', controlTickets); //Servicios para monitoreo de control por solicitud
  mainRouteApi.use('/profile', ticketsByClient); //Servicios de tickets por cliente
  mainRouteApi.use('/auth', authRouter); //Servicios de autenticación y autorización
  mainRouteApi.use('/planes', planesRouter); //Servicios de planes de mantenimiento
  mainRouteApi.use('/agentes', agentesRouter); //Servicios para gentes de soporte
  mainRouteApi.use('/reports', reports); //Servicios para geenración de reportes
}

module.exports = routerApi;
