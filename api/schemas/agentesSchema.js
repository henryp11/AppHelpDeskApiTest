const Joi = require('joi');

const id_agente = Joi.string().alphanum().min(4).max(4);
const cedula = Joi.string()
  .pattern(/^[0-9]+$/)
  .min(10)
  .max(10);
const nombre = Joi.string().max(50);
const fecha_nacimiento = Joi.date();
const sexo = Joi.string().max(1);
const fecha_ingreso = Joi.date();
const fecha_salida = Joi.date();
const cargo = Joi.string().max(50);
const horario = Joi.object({
  horario: Joi.string(),
  dias: Joi.string(),
  hora_inicio: Joi.string(),
  hora_fin: Joi.string(),
});
const nivel_atencion = Joi.string().max(2);
const estatus = Joi.boolean();
//Para Paginación
const offset = Joi.number().integer();
const limit = Joi.number().integer();

const createAgenteSchema = Joi.object({
  id_agente: id_agente,
  cedula: cedula.required(),
  nombre: nombre.required(),
  fecha_nacimiento: fecha_nacimiento,
  sexo: sexo,
  fecha_ingreso: fecha_ingreso.required(),
  cargo: cargo.required(),
  horario: horario,
  nivel_atencion: nivel_atencion,
  estatus: estatus,
});

const updateAgenteSchema = Joi.object({
  id_agente: id_agente,
  cedula: cedula,
  nombre: nombre,
  fecha_nacimiento: fecha_nacimiento,
  sexo: sexo,
  fecha_ingreso: fecha_ingreso,
  fecha_salida: fecha_salida,
  cargo: cargo,
  horario: horario,
  nivel_atencion: nivel_atencion,
  estatus: estatus,
});

const getAgenteSchema = Joi.object({
  id_agente: id_agente.required(),
});

const queryAgenteSchema = Joi.object({
  limit,
  offset,
});

module.exports = {
  createAgenteSchema,
  updateAgenteSchema,
  getAgenteSchema,
  queryAgenteSchema,
};
