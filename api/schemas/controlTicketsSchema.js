const Joi = require("joi");

const id_control = Joi.number().integer();
const id_ticket = Joi.number().integer();
const id_solicitud = Joi.number().integer();
const id_agente = Joi.string().alphanum().min(4).max(4);
const fecha_ini_atencion = Joi.date();
const fecha_fin_atencion = Joi.date();
const hora_ini_atencion = Joi.string().pattern(/^\d{2}:\d{2}:\d{2}$/);
const hora_fin_atencion = Joi.string().pattern(/^\d{2}:\d{2}:\d{2}$/);
const tiempo_calc = Joi.number().precision(6);
const reasignado = Joi.boolean();
const motivo_reasig = Joi.string().max(255);
const nivel_complejidad = Joi.string().max(2);
//Para Paginación
const offset = Joi.number().integer();
const limit = Joi.number().integer();

const createControlSchema = Joi.object({
  id_ticket: id_ticket,
  id_solicitud: id_solicitud,
  id_control: id_control,
  id_agente: id_agente.required(),
  fecha_ini_atencion: fecha_ini_atencion,
  fecha_fin_atencion: fecha_fin_atencion,
  hora_ini_atencion: hora_ini_atencion,
  hora_fin_atencion: hora_fin_atencion,
  tiempo_calc: tiempo_calc,
  reasignado: reasignado,
  motivo_reasig: motivo_reasig,
  nivel_complejidad: nivel_complejidad,
});

const updateControlSchema = Joi.object({
  id_ticket: id_ticket,
  id_solicitud: id_solicitud,
  id_control: id_control,
  id_agente: id_agente,
  fecha_ini_atencion: fecha_ini_atencion,
  fecha_fin_atencion: fecha_fin_atencion,
  hora_ini_atencion: hora_ini_atencion,
  hora_fin_atencion: hora_fin_atencion,
  tiempo_calc: tiempo_calc,
  reasignado: reasignado,
  motivo_reasig: motivo_reasig,
  nivel_complejidad: nivel_complejidad,
});

const getControlSchema = Joi.object({
  id_ticket: id_ticket,
  id_solicitud: id_solicitud,
  id_control: id_control,
});

const queryControlSchema = Joi.object({
  limit,
  offset,
});

module.exports = {
  createControlSchema,
  updateControlSchema,
  getControlSchema,
  queryControlSchema,
};
