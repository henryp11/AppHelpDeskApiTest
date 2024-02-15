const express = require('express');
const passport = require('passport');
const ReportServices = require('../services/reportService'); //Import clase de los servicios
const validatorHandler = require('../middlewares/validatorHandler');
const {
  createTicketSchema,
  updateTicketSchema,
  getTicketSchema,
  queryTicketSchema,
} = require('../schemas/mtrTicketsSchema');

const router = express.Router();
const service = new ReportServices(); //Creo el objeto para obtener los métodos de servicios

//Get para todos los tickets obteniendo parámetro de ruta
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  // validatorHandler(queryTicketSchema, 'query'),
  async (req, res, next) => {
    try {
      const data = await service.find(req.query);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
);

//Get para Tickets por id
router.get(
  '/:id_ticket',
  passport.authenticate('jwt', { session: false }),
  validatorHandler(getTicketSchema, 'params'), //Mando el esquema y las propidades de busqueda en este caso params
  async (req, res, next) => {
    try {
      const { id_ticket } = req.params;
      const regFind = await service.filterId(id_ticket);
      res.json(regFind);
    } catch (error) {
      next(error);
    }
  }
);

//Get para Tickets por id y solicitud para filtrar por el  seguimiento de control para cada solicitud dentro del ticket
router.get(
  '/control/:id_ticket/:id_solicitud',
  passport.authenticate('jwt', { session: false }),
  // validatorHandler(getTicketSchema, 'params'), //Mando el esquema y las propidades de busqueda en este caso params
  async (req, res, next) => {
    try {
      const { id_ticket, id_solicitud } = req.params;
      const regFind = await service.filterIdControlBySolicitud(
        id_ticket,
        id_solicitud
      );
      res.json(regFind);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
