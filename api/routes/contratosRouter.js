const express = require('express');
const passport = require('passport');
const ContratosServices = require('../services/contratosService'); //Import clase de los servicios
const validatorHandler = require('../middlewares/validatorHandler');
const { checkAdminRole } = require('../middlewares/authHandler'); //Traigo el validador de permisos
const {
  createContratoSchema,
  updateContratoSchema,
  getContratoSchema,
} = require('../schemas/contratosSchema');

const router = express.Router();
const service = new ContratosServices(); //Creo el objeto de servicios

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
  validatorHandler(createContratoSchema, 'body'),
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
  '/:id_contrato',
  passport.authenticate('jwt', { session: false }),
  checkAdminRole,
  validatorHandler(getContratoSchema, 'params'), //Mando el esquema y las propidades de busqueda en este caso params
  async (req, res, next) => {
    try {
      const { id_contrato } = req.params;
      const regFind = await service.filterId(id_contrato);
      res.json(regFind);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/:id_contrato',
  passport.authenticate('jwt', { session: false }),
  checkAdminRole,
  validatorHandler(getContratoSchema, 'params'), //Primero valido el id
  validatorHandler(updateContratoSchema, 'body'), //luego el body
  async (req, res, next) => {
    try {
      const { id_contrato } = req.params;
      const body = req.body;
      const regUpdate = await service.update(id_contrato, body);
      res.json(regUpdate);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:id_contrato',
  passport.authenticate('jwt', { session: false }),
  checkAdminRole,
  validatorHandler(getContratoSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id_contrato } = req.params;
      const regDelete = await service.delete(id_contrato);
      res.json(regDelete);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
