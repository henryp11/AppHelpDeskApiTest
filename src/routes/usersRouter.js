const express = require('express');
const passport = require('passport');
const UsersServices = require('../services/usersService'); //Import clase de los servicios
const validatorHandler = require('../middlewares/validatorHandler');
const { checkAdminRole } = require('../middlewares/authHandler'); //Traigo el validador de permisos
const {
  createUserSchema,
  updateUserSchema,
  getUserSchema,
} = require('../schemas/usersSchema');

const router = express.Router();
const service = new UsersServices(); //Creo el objeto de servicios

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
  validatorHandler(createUserSchema, 'body'),
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
  '/:id_user',
  validatorHandler(getUserSchema, 'params'), //Mando el esquema y las propidades de busqueda en este caso params
  async (req, res, next) => {
    try {
      const { id_user } = req.params;
      const regFind = await service.filterId(id_user);
      res.json(regFind);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/:id_user',
  validatorHandler(getUserSchema, 'params'), //Primero valido el id
  validatorHandler(updateUserSchema, 'body'), //luego el body
  async (req, res, next) => {
    try {
      const { id_user } = req.params;
      const body = req.body;
      const regUpdate = await service.update(id_user, body);
      res.json(regUpdate);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:id_user',
  passport.authenticate('jwt', { session: false }),
  checkAdminRole,
  validatorHandler(getUserSchema, 'params'), //Primero valido el id
  async (req, res, next) => {
    try {
      const { id_user } = req.params;
      const regDelete = await service.delete(id_user);
      res.json(regDelete);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
