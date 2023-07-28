const express = require("express");
const passport = require("passport");
const PersonalEmpServices = require("../services/personalEmpService"); //Import clase de los servicios
const validatorHandler = require("../middlewares/validatorHandler");
const { checkAdminRole, checkRoles } = require("../middlewares/authHandler"); //Traigo el validador de permisos
const {
  createPersonalEmpSchema,
  updatePersonalEmpSchema,
  getPersonalEmpSchema,
  queryPersonalEmpSchema,
} = require("../schemas/personalEmpSchema");

const router = express.Router();
const service = new PersonalEmpServices(); //Creo el objeto de servicios

//Get para todas las empresas con paginación
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  checkRoles("admin", "supervisor"),
  async (req, res, next) => {
    validatorHandler(queryPersonalEmpSchema, "query");
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
  "/",
  passport.authenticate("jwt", { session: false }),
  //Una vez validad la capa de autenticación, obtiene el payload para usar el middleware de permisos
  validatorHandler(createPersonalEmpSchema, "body"),
  async (req, res, next) => {
    try {
      const body = req.body;
      const user = req.user;
      const newReg = await service.create(body, user.sub);
      res.status(201).json(newReg);
    } catch (error) {
      next(error);
    }
  }
);

//Get para empresa por id
router.get(
  "/:id_per",
  validatorHandler(getPersonalEmpSchema, "params"), //Mando el esquema y las propidades de busqueda en este caso params
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
  "/:id_per",
  validatorHandler(getPersonalEmpSchema, "params"), //Primero valido el id
  validatorHandler(updatePersonalEmpSchema, "body"), //luego el body
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
  "/:id_per",
  validatorHandler(getPersonalEmpSchema, "params"), //Primero valido el id
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
