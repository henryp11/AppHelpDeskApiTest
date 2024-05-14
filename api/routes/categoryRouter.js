const express = require('express');
const passport = require('passport');
const CategoryServices = require('../services/categoryService'); //Import clase de los servicios
const validatorHandler = require('../middlewares/validatorHandler');
const { checkAdminRole, checkRoles } = require('../middlewares/authHandler'); //Traigo el validador de permisos
const {
  createCategSchema,
  updateCategSchema,
  getCategSchema,
  queryCategSchema,
} = require('../schemas/categorySchema');

const router = express.Router();
const service = new CategoryServices(); //Creo el objeto de servicios

//Get para todos las categorías con paginación
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin', 'cliente', 'supervisor', 'agente'),
  async (req, res, next) => {
    validatorHandler(queryCategSchema, 'query');
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
  validatorHandler(createCategSchema, 'body'),
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

//Get por id
router.get(
  '/:id_cat',
  passport.authenticate('jwt', { session: false }),
  checkAdminRole,
  validatorHandler(getCategSchema, 'params'), //Mando el esquema y las propidades de busqueda en este caso params
  async (req, res, next) => {
    try {
      const { id_cat } = req.params;
      const regFind = await service.filterId(id_cat);
      res.json(regFind);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/:id_cat',
  passport.authenticate('jwt', { session: false }),
  checkAdminRole,
  validatorHandler(getCategSchema, 'params'), //Primero valido el id
  validatorHandler(updateCategSchema, 'body'), //luego el body
  async (req, res, next) => {
    try {
      const { id_cat } = req.params;
      const body = req.body;
      const regUpdate = await service.update(id_cat, body);
      res.json(regUpdate);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:id_cat',
  passport.authenticate('jwt', { session: false }),
  checkAdminRole,
  validatorHandler(getCategSchema, 'params'), //Primero valido el id
  async (req, res, next) => {
    try {
      const { id_cat } = req.params;
      const regDelete = await service.delete(id_cat);
      res.json(regDelete);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
