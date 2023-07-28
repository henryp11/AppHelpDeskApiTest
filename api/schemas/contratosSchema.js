const Joi = require("joi");

// const id = Joi.string().uuid(); //No se le coloca como requerido ya que lo autogenero
const id_contrato = Joi.string().alphanum().min(7).max(7);
const id_emp = Joi.string().alphanum().min(4).max(4);
const id_plan = Joi.string().alphanum().min(3).max(3);
const fecha_inicio = Joi.date();
const fecha_fin = Joi.date();
const fecha_extendida = Joi.date();
const flag_vigente = Joi.boolean();
const factura = Joi.string().alphanum().min(9).max(16);
const observac = Joi.string().max(50);
const estatus = Joi.boolean();

//Creo el esquema como un Objeto, mando cada campo, donde tambien
//Puedo colocar si son campos requeridos o no, por lo que solo puedo enviar los requeridos
const createContratoSchema = Joi.object({
  id_contrato: id_contrato,
  id_emp: id_emp.required(),
  id_plan: id_plan.required(),
  fecha_inicio: fecha_inicio,
  fecha_fin: fecha_fin,
  flag_vigente: flag_vigente,
  fecha_extendida: fecha_extendida,
  estatus: estatus,
});

const updateContratoSchema = Joi.object({
  id_contrato: id_contrato,
  id_emp: id_emp,
  id_plan: id_plan,
  fecha_inicio: fecha_inicio,
  fecha_fin: fecha_fin,
  flag_vigente: flag_vigente,
  fecha_extendida: fecha_extendida,
  factura: factura,
  observac: observac,
  estatus: estatus,
});

const getContratoSchema = Joi.object({
  id_contrato: id_contrato.required(),
});

module.exports = {
  createContratoSchema,
  updateContratoSchema,
  getContratoSchema,
};
