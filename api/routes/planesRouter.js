const express = require('express');
const passport = require('passport');
const PlanServices = require('../services/planesService'); //Import clase de los servicios
const validatorHandler = require('../middlewares/validatorHandler');
const { checkAdminRole } = require('../middlewares/authHandler'); //Traigo el validador de permisos
const {
  createPlanSchema,
  updatePlanSchema,
  getPlanSchema,
  queryPlanSchema,
} = require('../schemas/planesSchema');

const router = express.Router();
const service = new PlanServices(); //Creo el objeto de servicios

//Get para todos los planes con paginación
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  checkAdminRole,
  async (req, res, next) => {
    validatorHandler(queryPlanSchema, 'query');
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
  '/',
  passport.authenticate('jwt', { session: false }),
  checkAdminRole,
  //Una vez validad la capa de autenticación, obtiene el payload para usar el middleware de permisos
  validatorHandler(createPlanSchema, 'body'),
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

//Get para empresa por id
router.get(
  '/:id_plan',
  passport.authenticate('jwt', { session: false }),
  checkAdminRole,
  validatorHandler(getPlanSchema, 'params'), //Mando el esquema y las propidades de busqueda en este caso params
  async (req, res, next) => {
    try {
      const { id_plan } = req.params;
      const regFind = await service.filterId(id_plan);
      res.json(regFind);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/:id_plan',
  passport.authenticate('jwt', { session: false }),
  checkAdminRole,
  validatorHandler(getPlanSchema, 'params'), //Primero valido el id
  validatorHandler(updatePlanSchema, 'body'), //luego el body
  async (req, res, next) => {
    try {
      const { id_plan } = req.params;
      const body = req.body;
      const regUpdate = await service.update(id_plan, body);
      res.json(regUpdate);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:id_plan',
  passport.authenticate('jwt', { session: false }),
  checkAdminRole,
  validatorHandler(getPlanSchema, 'params'), //Primero valido el id
  async (req, res, next) => {
    try {
      const { id_plan } = req.params;
      const regDelete = await service.delete(id_plan);
      res.json(regDelete);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
