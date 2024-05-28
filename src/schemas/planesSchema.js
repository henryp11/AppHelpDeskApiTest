const Joi = require("joi");

const id_plan = Joi.string().alphanum().min(3).max(3);
const nombre_plan = Joi.string().min(3).max(50);
const abrev = Joi.string().alphanum().min(1).max(3);
const dias_vigencia = Joi.number().integer();
const horas_sop = Joi.number().integer();
const estatus = Joi.boolean();
//Para Paginación
const offset = Joi.number().integer();
const limit = Joi.number().integer();

const createPlanSchema = Joi.object({
  id_plan: id_plan,
  nombre_plan: nombre_plan.required(),
  abrev: abrev,
  dias_vigencia: dias_vigencia.required(),
  horas_sop: horas_sop.required(),
  estatus: estatus,
});

const updatePlanSchema = Joi.object({
  id_plan: id_plan,
  nombre_plan: nombre_plan,
  abrev: abrev,
  dias_vigencia: dias_vigencia,
  horas_sop: horas_sop,
  estatus: estatus,
});

const getPlanSchema = Joi.object({
  id_plan: id_plan.required(),
});

const queryPlanSchema = Joi.object({
  limit,
  offset,
});

module.exports = {
  createPlanSchema,
  updatePlanSchema,
  getPlanSchema,
  queryPlanSchema,
};
