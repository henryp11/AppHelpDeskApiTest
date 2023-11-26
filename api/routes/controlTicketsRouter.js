const express = require('express');
const passport = require('passport');
const ControlTicketServices = require('../services/controlTicketService'); //Import clase de los servicios
const validatorHandler = require('../middlewares/validatorHandler');
const { checkAdminRole, checkRoles } = require('../middlewares/authHandler'); //Traigo el validador de permisos
const {
  createControlSchema,
  updateControlSchema,
  getControlSchema,
  queryControlSchema,
} = require('../schemas/controlTicketsSchema');

const router = express.Router();
const service = new ControlTicketServices(); //Creo el objeto de servicios

//Get para todas las empresas con paginación
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    validatorHandler(queryControlSchema, 'query');
    try {
      const data = await service.find(req.query);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
);

//Creando Post
router.post(
  '/:id_ticket/:id_solicitud',
  passport.authenticate('jwt', { session: false }),
  //Una vez validad la capa de autenticación, obtiene el payload para usar el middleware de permisos
  validatorHandler(getControlSchema, 'params'),
  validatorHandler(createControlSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id_ticket, id_solicitud } = req.params;
      const body = req.body;
      // const user = req.user;
      const newReg = await service.create(body, id_ticket, id_solicitud);
      res.status(201).json(newReg);
    } catch (error) {
      next(error);
    }
  }
);

//Get controles por ticket
router.get(
  '/:id_ticket',
  passport.authenticate('jwt', { session: false }),
  validatorHandler(getControlSchema, 'params'), //Mando el esquema y las propidades de busqueda en este caso params
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

//Get por ticket y por solicitud con controles en las solicitud
router.get(
  '/:id_ticket/:id_solicitud',
  passport.authenticate('jwt', { session: false }),
  validatorHandler(getControlSchema, 'params'), //Mando el esquema y las propidades de busqueda en este caso params
  async (req, res, next) => {
    try {
      const { id_ticket, id_solicitud } = req.params;
      const regFind = await service.filterByTicketSolicitud(
        id_ticket,
        id_solicitud
      );
      res.json(regFind);
    } catch (error) {
      next(error);
    }
  }
);
//Get solo solicitud específica
router.get(
  '/:id_solicitud',
  passport.authenticate('jwt', { session: false }),
  validatorHandler(getControlSchema, 'params'), //Mando el esquema y las propidades de busqueda en este caso params
  async (req, res, next) => {
    try {
      const { id_solicitud } = req.params;
      const regFind = await service.filterId(id_solicitud);
      res.json(regFind);
    } catch (error) {
      next(error);
    }
  }
);

//REVISAR FUNCION PARA ACTUALZIAR POR BUSQUEDA DENTRO DEL TICKET
router.patch(
  '/:id_control',
  passport.authenticate('jwt', { session: false }),
  validatorHandler(getControlSchema, 'params'), //Primero valido el id
  validatorHandler(updateControlSchema, 'body'), //luego el body
  async (req, res, next) => {
    try {
      const { id_control } = req.params;
      const body = req.body;
      const regUpdate = await service.update(id_control, body);
      res.json(regUpdate);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:id_control',
  passport.authenticate('jwt', { session: false }),
  validatorHandler(getControlSchema, 'params'), //Primero valido el id
  async (req, res, next) => {
    try {
      const { id_control } = req.params;
      const regDelete = await service.delete(id_control);
      res.json(regDelete);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
