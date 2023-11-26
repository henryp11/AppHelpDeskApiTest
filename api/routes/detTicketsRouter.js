const express = require('express');
const passport = require('passport');
const DetTicketServices = require('../services/detTicketService'); //Import clase de los servicios
const validatorHandler = require('../middlewares/validatorHandler');
const { checkAdminRole, checkRoles } = require('../middlewares/authHandler'); //Traigo el validador de permisos
const {
  createSolicitudSchema,
  updateSolicitudSchema,
  getSolicitudSchema,
  querySolicitudSchema,
} = require('../schemas/detTicketsSchema');

const router = express.Router();
const service = new DetTicketServices(); //Creo el objeto de servicios

//Get para todas las empresas con paginación
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    validatorHandler(querySolicitudSchema, 'query');
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
  '/:id_ticket',
  passport.authenticate('jwt', { session: false }),
  //Una vez validad la capa de autenticación, obtiene el payload para usar el middleware de permisos
  validatorHandler(getSolicitudSchema, 'params'),
  validatorHandler(createSolicitudSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id_ticket } = req.params;
      const body = req.body;
      // const user = req.user;
      const newReg = await service.create(body, id_ticket);
      res.status(201).json(newReg);
    } catch (error) {
      next(error);
    }
  }
);

//Get por ticket con todas sus solicitudes
router.get(
  '/:id_ticket',
  passport.authenticate('jwt', { session: false }),
  validatorHandler(getSolicitudSchema, 'params'), //Mando el esquema y las propidades de busqueda en este caso params
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
//Get solo solicitud específica
router.get(
  '/:id_solicitud',
  passport.authenticate('jwt', { session: false }),
  validatorHandler(getSolicitudSchema, 'params'), //Mando el esquema y las propidades de busqueda en este caso params
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

//REVISAR FUNCION PARA ACTUALIZAR POR BUSQUEDA DENTRO DEL TICKET
router.patch(
  '/:id_ticket/:id_solicitud',
  passport.authenticate('jwt', { session: false }),
  validatorHandler(getSolicitudSchema, 'params'), //Primero valido el id
  validatorHandler(updateSolicitudSchema, 'body'), //luego el body
  async (req, res, next) => {
    try {
      const { id_ticket, id_solicitud } = req.params;
      const body = req.body;
      const regUpdate = await service.update(id_ticket, id_solicitud, body);
      res.json(regUpdate);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:id_solicitud',
  passport.authenticate('jwt', { session: false }),
  validatorHandler(getSolicitudSchema, 'params'), //Primero valido el id
  async (req, res, next) => {
    try {
      const { id_solicitud } = req.params;
      const regDelete = await service.delete(id_solicitud);
      res.json(regDelete);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
