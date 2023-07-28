const Joi = require("joi");

//Realizo un esquema para cada campo para validar su formato
// se debe empezar por indicar el tipo de campo y luego la validación

// const id = Joi.string().uuid(); //No se le coloca como requerido ya que lo autogenero
const id_emp = Joi.string().alphanum().min(4).max(4);
const nombre_emp = Joi.string().min(2).max(30);
const ruc = Joi.string()
  .pattern(/^[0-9]+$/)
  .min(13)
  .max(13);
const direccion = Joi.string().min(2).max(30);
const telefono = Joi.string().min(2).max(15);
const correo = Joi.string().email().max(30);
const correo_secund = Joi.string().email().max(30);
const ciudad = Joi.string().min(2).max(15);
const planMant = Joi.boolean();
const estatus = Joi.boolean();
//Para Paginación
const offset = Joi.number().integer();
const limit = Joi.number().integer();

//Creo el esquema como un Objeto, mando cada campo, donde tambien
//Puedo colocar si son campos requeridos o no, por lo que solo puedo enviar los requeridos
//De tal forma que puedo crear una validación para cada acción de CRUD
const createEmpresaSchema = Joi.object({
  id_emp: id_emp.required(),
  nombre_emp: nombre_emp.required(),
  ruc: ruc.required(),
  direccion: direccion.required(),
  telefono: telefono.required(),
  correo: correo.required(),
  correo_secund: correo_secund,
  ciudad: ciudad,
  planMant: planMant,
  estatus: estatus,
});

const updateEmpresaSchema = Joi.object({
  nombre_emp: nombre_emp,
  ruc: ruc,
  direccion: direccion,
  telefono: telefono,
  correo: correo,
  correo_secund: correo_secund,
  ciudad: ciudad,
  planMant: planMant,
  estatus: estatus,
});

const getEmpresaSchema = Joi.object({
  id_emp: id_emp.required(),
});

const queryEmpresaSchema = Joi.object({
  limit,
  offset,
  planMant,
});

module.exports = {
  createEmpresaSchema,
  updateEmpresaSchema,
  getEmpresaSchema,
  queryEmpresaSchema,
};
