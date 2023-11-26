const express = require('express');
const passport = require('passport');
const PersonalEmpServices = require('../services/personalEmpService'); //Import clase de los servicios
const validatorHandler = require('../middlewares/validatorHandler');
const { checkRoles } = require('../middlewares/authHandler'); //Traigo el validador de permisos
const {
  createPersonalEmpSchema,
  updatePersonalEmpSchema,
  getPersonalEmpSchema,
  queryPersonalEmpSchema,
} = require('../schemas/personalEmpSchema');

const router = express.Router();
const service = new PersonalEmpServices(); //Creo el objeto de servicios

//Get para el personal de las empresas con paginación
//Dependiendo del rol del usuario mostrará de todas las empresas (admin) o solo de la empresa que le corresponde (supervisor)
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin', 'supervisor'),
  // validatorHandler(queryPersonalEmpSchema, 'query'),
  async (req, res, next) => {
    try {
      const data = await service.find(req.query);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
);

//Creando Personal. Depende del perfil se asignará o no el id_user,
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin', 'supervisor', 'cliente'),
  //Una vez validad la capa de autenticación, obtiene el payload para usar el middleware de permisos
  validatorHandler(createPersonalEmpSchema, 'body'),
  async (req, res, next) => {
    console.log(req);
    try {
      const body = req.body;
      console.log({ bodyRouterPersonal: body });
      const user = req.user; //el objeto user viene de req del payload de JWT
      const newReg = await service.create(body, user.sub, user.perfil);
      res.status(201).json(newReg);
    } catch (error) {
      next(error);
    }
  }
);

//Get para empresa por id
router.get(
  '/:id_per',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin', 'supervisor', 'cliente'),
  validatorHandler(getPersonalEmpSchema, 'params'), //Mando el esquema y las propidades de busqueda en este caso params
  async (req, res, next) => {
    try {
      const { id_per } = req.params;
      const regFind = await service.filterId(id_per);
      res.json(regFind);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/:id_per',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin', 'supervisor', 'cliente'),
  validatorHandler(getPersonalEmpSchema, 'params'), //Primero valido el id
  validatorHandler(updatePersonalEmpSchema, 'body'), //luego el body
  async (req, res, next) => {
    try {
      const { id_per } = req.params;
      const body = req.body;
      const regUpdate = await service.update(id_per, body);
      res.json(regUpdate);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:id_per',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin', 'supervisor'),
  validatorHandler(getPersonalEmpSchema, 'params'), //Primero valido el id
  async (req, res, next) => {
    try {
      const { id_per } = req.params;
      const regDelete = await service.delete(id_per);
      res.json(regDelete);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
