const express = require('express');
const passport = require('passport');
const MtrTicketServices = require('../services/mtrTicketService'); //Import clase de los servicios
const validatorHandler = require('../middlewares/validatorHandler');
const {
  createTicketSchema,
  updateTicketSchema,
  getTicketSchema,
  queryTicketSchema,
} = require('../schemas/mtrTicketsSchema');

const router = express.Router();
const service = new MtrTicketServices(); //Creo el objeto para obtener los métodos de servicios

//Get para todos los tickets obteniendo parámetro de ruta
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  validatorHandler(queryTicketSchema, 'query'),
  async (req, res, next) => {
    try {
      const data = await service.find(req.query);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/count',
  passport.authenticate('jwt', { session: false }),
  validatorHandler(queryTicketSchema, 'query'),
  async (req, res, next) => {
    try {
      const data = await service.counterReg(req.query);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
);

//Creando Post
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  //Una vez validad la capa de autenticación, obtiene el payload para usar el middleware de permisos
  validatorHandler(createTicketSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const user = req.user; //el objeto user viene de req del payload de JWT
      console.log({ userMtr: user });
      const newReg = await service.create(
        body,
        user.idClient,
        user.idEmp,
        user.perfil
      ); //Se envía perfil para saber si crea el ticket un cliente o un agente/admin
      res.status(201).json(newReg);
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

router.patch(
  '/:id_ticket',
  passport.authenticate('jwt', { session: false }),
  validatorHandler(getTicketSchema, 'params'), //Primero valido el id
  validatorHandler(updateTicketSchema, 'body'), //luego el body
  async (req, res, next) => {
    try {
      const { id_ticket } = req.params;
      const body = req.body;
      const regUpdate = await service.update(id_ticket, body);
      res.json(regUpdate);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:id_ticket',
  validatorHandler(getTicketSchema, 'params'), //Primero valido el id
  async (req, res, next) => {
    try {
      const { id_ticket } = req.params;
      const regDelete = await service.delete(id_ticket);
      res.json(regDelete);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
