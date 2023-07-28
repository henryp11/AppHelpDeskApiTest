const Joi = require("joi");

const id_per = Joi.string()
  .pattern(/^[0-9]+$/)
  .min(10)
  .max(10);
const id_emp = Joi.string().alphanum().min(4).max(4);
const nombre = Joi.string().min(2).max(50);
const telf1 = Joi.string().min(2).max(15);
const telf2 = Joi.string().min(2).max(15);
const cargo = Joi.string().max(15);
const depto = Joi.string().max(15);
const correo = Joi.string().email().max(100);
const id_user = Joi.number().integer();
const estatus = Joi.boolean();
//Para Paginación
const offset = Joi.number().integer();
const limit = Joi.number().integer();

const createPersonalEmpSchema = Joi.object({
  id_per: id_per.required(),
  id_emp: id_emp.required(),
  nombre: nombre.required(),
  telf1: telf1.required(),
  telf2: telf2,
  cargo: cargo,
  depto: depto,
  correo: correo.required(),
  id_user: id_user,
  estatus: estatus,
});

const updatePersonalEmpSchema = Joi.object({
  id_emp: id_emp,
  nombre: nombre,
  telf1: telf1,
  telf2: telf2,
  cargo: cargo,
  depto: depto,
  correo: correo,
  estatus: estatus,
});

const getPersonalEmpSchema = Joi.object({
  id_per: id_per.required(),
});

const queryPersonalEmpSchema = Joi.object({
  limit,
  offset,
});

module.exports = {
  createPersonalEmpSchema,
  updatePersonalEmpSchema,
  getPersonalEmpSchema,
  queryPersonalEmpSchema,
};
