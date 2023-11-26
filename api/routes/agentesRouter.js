const express = require('express');
const passport = require('passport');
const AgentesServices = require('../services/agentesService'); //Import clase de los servicios
const validatorHandler = require('../middlewares/validatorHandler');
const { checkAdminRole } = require('../middlewares/authHandler'); //Traigo el validador de permisos
const {
  createAgenteSchema,
  updateAgenteSchema,
  getAgenteSchema,
} = require('../schemas/agentesSchema');

const router = express.Router();
const service = new AgentesServices(); //Creo el objeto de servicios

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  checkAdminRole,
  async (req, res, next) => {
    try {
      const data = await service.find();
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  checkAdminRole,
  validatorHandler(createAgenteSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newReg = await service.create(body);
      res.status(201).json(newReg);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/:id_agente',
  passport.authenticate('jwt', { session: false }),
  checkAdminRole,
  validatorHandler(getAgenteSchema, 'params'), //Mando el esquema y las propidades de busqueda en este caso params
  async (req, res, next) => {
    try {
      const { id_agente } = req.params;
      const regFind = await service.filterId(id_agente);
      res.json(regFind);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/:id_agente',
  passport.authenticate('jwt', { session: false }),
  checkAdminRole,
  validatorHandler(getAgenteSchema, 'params'), //Primero valido el id
  validatorHandler(updateAgenteSchema, 'body'), //luego el body
  async (req, res, next) => {
    try {
      const { id_agente } = req.params;
      const body = req.body;
      const regUpdate = await service.update(id_agente, body);
      res.json(regUpdate);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:id_agente',
  passport.authenticate('jwt', { session: false }),
  checkAdminRole,
  validatorHandler(getAgenteSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id_agente } = req.params;
      const regDelete = await service.delete(id_agente);
      res.json(regDelete);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
