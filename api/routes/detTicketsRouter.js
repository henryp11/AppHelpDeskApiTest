const express = require('express');
const passport = require('passport');
const DetTicketServices = require('../services/detTicketService'); //Import clase de los servicios
const AuthService = require('../services/authService');
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
const serviceMail = new AuthService();

//Get para todas las solicitudes con paginación
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  validatorHandler(querySolicitudSchema, 'query'),
  async (req, res, next) => {
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
      const regFind = await service.filterAllSolByTicket(id_ticket);
      res.json(regFind);
    } catch (error) {
      next(error);
    }
  }
);

// router.get(
//   '/solicitud/:id_solicitud',
//   passport.authenticate('jwt', { session: false }),
//   validatorHandler(getSolicitudSchema, 'params'), //Mando el esquema y las propidades de busqueda en este caso params
//   async (req, res, next) => {
//     try {
//       const { id_solicitud } = req.params;
//       const regFind = await service.filterId(id_solicitud);
//       res.json(regFind);
//     } catch (error) {
//       next(error);
//     }
//   }
// );
//Get solo ticket y solicitud específicos
router.get(
  '/:id_ticket/:id_solicitud',
  passport.authenticate('jwt', { session: false }),
  validatorHandler(getSolicitudSchema, 'params'), //Primero valido el id
  async (req, res, next) => {
    try {
      const { id_ticket, id_solicitud } = req.params;
      const regFind = await service.filterIdTicketIdSolicitud(
        id_ticket,
        id_solicitud
      );
      res.json(regFind);
    } catch (error) {
      next(error);
    }
  }
);

//ACTUALIZAR POR BUSQUEDA DENTRO DEL TICKET
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

//Enviar correo de confirmación de agente asignado
router.post(
  '/sendMail/assigned',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    console.log(req);
    try {
      const {
        id_ticket,
        id_solicitud,
        emailClient,
        agente,
        estatus,
        descripSolic,
        detSolucion,
      } = req.body;
      const response = await serviceMail.sendMailTicketAsign(
        id_ticket,
        id_solicitud,
        emailClient,
        agente,
        estatus,
        descripSolic,
        detSolucion
      );
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
);

//Delete de todas las solicitudes de un ticket
router.delete(
  '/:id_ticket',
  passport.authenticate('jwt', { session: false }),
  // validatorHandler(getSolicitudSchema, 'params'), //Primero valido el id
  async (req, res, next) => {
    try {
      const { id_ticket } = req.params;
      const regDelete = await service.deleteAllSolic(id_ticket);
      res.json(regDelete);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
