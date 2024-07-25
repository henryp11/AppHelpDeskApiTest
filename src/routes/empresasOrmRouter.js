const express = require('express');
const passport = require('passport');
const EmpresasORMServices = require('../services/empresaServiceORM'); //Import clase de los servicios
const validatorHandler = require('../middlewares/validatorHandler');
const { checkRoles } = require('../middlewares/authHandler'); //Traigo el validador de permisos
const {
  createEmpresaSchema,
  updateEmpresaSchema,
  getEmpresaSchema,
  queryEmpresaSchema,
} = require('../schemas/empresasSchema');

const router = express.Router();
const service = new EmpresasORMServices(); //Creo el objeto de servicios

//Get para todas las empresas con paginación
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin', 'agente'),
  validatorHandler(queryEmpresaSchema, 'query'),
  async (req, res, next) => {
    try {
      const empresas = await service.find(req.query);
      res.json(empresas);
    } catch (error) {
      next(error);
    }
  }
);

//Get para buscar empresas por su Ruc
router.get(
  '/ruc',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin', 'cliente'),
  validatorHandler(queryEmpresaSchema, 'query'),
  async (req, res, next) => {
    try {
      const empresas = await service.filterRuc(req.query);
      res.json(empresas);
    } catch (error) {
      next(error);
    }
  }
);
// //Get para todas las empresas
// router.get("/", async (req, res, next) => {
//   try {
//     const empresas = await service.find();
//     res.json(empresas);
//   } catch (error) {
//     next(error);
//   }
// });

//Creando Post
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  //Una vez validad la capa de autenticación, obtiene el payload para usar el middleware de permisos
  checkRoles('admin'),
  validatorHandler(createEmpresaSchema, 'body'),
  async (req, res, next) => {
    try {
      // Traigo todo el cuerpo de la petición del post. Es decir lo que está enviando el cliente
      const body = req.body;
      const newEmpresa = await service.create(body);
      res.status(201).json(newEmpresa);
    } catch (error) {
      next(error);
    }
  }
);

//Get para empresa por id
router.get(
  '/:id_emp',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin', 'agente', 'supervisor'),
  validatorHandler(getEmpresaSchema, 'params'), //Mando el esquema y las propidades de busqueda en este caso params
  async (req, res, next) => {
    try {
      const { id_emp } = req.params;
      const empresaById = await service.filterId(id_emp);
      res.json(empresaById);
    } catch (error) {
      next(error); //Aquí ejecuto todos los middleware de tipo error creados
    }
  }
);

// Patch para actualización Parcial
//Se requiere un ID enviar como Parametro de ruta
router.patch(
  '/:id_emp',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin'),
  validatorHandler(getEmpresaSchema, 'params'), //Primero valido el id
  validatorHandler(updateEmpresaSchema, 'body'), //luego el body
  async (req, res, next) => {
    try {
      const { id_emp } = req.params;
      const body = req.body;
      const updateEmpresa = await service.update(id_emp, body);
      res.json(updateEmpresa);
    } catch (error) {
      next(error);
    }
  }
);

//Delete: Se requiere un ID enviar como Parametro de ruta
router.delete(
  '/:id_emp',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin'),
  validatorHandler(getEmpresaSchema, 'params'), //Primero valido el id
  async (req, res, next) => {
    try {
      const { id_emp } = req.params;
      const deleteEmpresa = await service.delete(id_emp);
      res.json(deleteEmpresa);
    } catch (error) {
      next(error);
    }
  }
);

// //Creando Put para actualización total

// //Se requiere un ID enviar como Parametro de ruta
// router.put("/:id", (req, res) => {
//   const { id } = req.params;
//   const body = req.body;
//   res.json({
//     message: "Empresa Actualiza Correctamente",
//     id,
//     data: body,
//   });
// });

module.exports = router;
