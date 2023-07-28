const express = require("express");
const EmpresasDbServices = require("../services/empresaDbService"); //Import clase de los servicios
const validatorHandler = require("../middlewares/validatorHandler");
const {
  createEmpresaSchema,
  updateEmpresaSchema,
  getEmpresaSchema,
} = require("../schemas/empresasSchema");

const router = express.Router();
const service = new EmpresasDbServices(); //Creo el objeto de servicios

//Get para todas las empresas
router.get("/", async (req, res, next) => {
  try {
    const empresas = await service.find();
    res.json(empresas);
  } catch (error) {
    next(error);
  }
});

// //Get para empresa por id
// router.get(
//   "/:id",
//   validatorHandler(getEmpresaSchema, "params"), //Mando el esquema y las propidades de busqueda en este caso params
//   async (req, res, next) => {
//     try {
//       const { id } = req.params;
//       const empresaById = await service.filterId(id);
//       res.json(empresaById);
//     } catch (error) {
//       next(error); //Aquí ejecuto todos los middleware de tipo error creados
//     }
//   }
// );

// //Creando Post
// router.post(
//   "/",
//   validatorHandler(createEmpresaSchema, "body"),
//   async (req, res) => {
//     // Traigo todo el cuerpo de la petición del post. Es decir lo que está enviando el cliente
//     const body = req.body;
//     const newEmpresa = await service.create(body);
//     res.status(201).json(newEmpresa);
//   }
// );

// //Creando Patch para actualización Parcial
// //Se requiere un ID enviar como Parametro de ruta
// router.patch(
//   "/:id",
//   validatorHandler(getEmpresaSchema, "params"), //Primero valido el id
//   validatorHandler(updateEmpresaSchema, "body"), //luego el body
//   async (req, res, next) => {
//     try {
//       const { id } = req.params;
//       const body = req.body;
//       const updateEmpresa = await service.update(id, body);
//       res.json(updateEmpresa);
//     } catch (error) {
//       // Respuesta manual sin usar
//       // res
//       //   .status(404)
//       //   .json({ message: "Mensaje desde Patch", error: error.message });
//       next(error);
//     }
//   }
// );

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

// //Creando Delete
// //Se requiere un ID enviar como Parametro de ruta
// router.delete("/:id", async (req, res) => {
//   const { id } = req.params;
//   const deleteEmpresa = await service.delete(id);
//   res.json(deleteEmpresa);
// });

module.exports = router;
