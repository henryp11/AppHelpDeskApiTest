const Joi = require('joi');

const id_ticket = Joi.number().integer();
const id_cliente = Joi.string()
  .pattern(/^[0-9]+$/)
  .min(10)
  .max(10);
const id_emp = Joi.string().alphanum().min(4).max(4);
const prioridad = Joi.string().alphanum().min(4).max(4);
const id_tipo = Joi.string().alphanum().min(4).max(4);
const descrip_tk = Joi.string().min(4).max(255);
const fecha_reg = Joi.any(); //Verficar validación formato timestamp
const fecha_ini_sop = Joi.any();
const fecha_fin_sop = Joi.any();
const tiempo_calc_sop = Joi.number().precision(2);
const tiempo_diferencial = Joi.number().precision(2);
const tiempo_real_sop = Joi.number().precision(2);
const estatus = Joi.string().max(11);
//Para Paginación y querys
const offset = Joi.number().integer();
const limit = Joi.number().integer();
const idemp = Joi.any();
const rol = Joi.any();
const idclient = Joi.any();
const tracking = Joi.any();

const createTicketSchema = Joi.object({
  id_ticket: id_ticket,
  id_cliente: id_cliente,
  id_emp: id_emp,
  prioridad: prioridad,
  id_tipo: id_tipo,
  descrip_tk: descrip_tk.required(),
  fecha_reg: fecha_reg,
  estatus: estatus,
});

const updateTicketSchema = Joi.object({
  id_ticket: id_ticket,
  id_cliente: id_cliente,
  id_emp: id_emp,
  prioridad: prioridad,
  id_tipo: id_tipo,
  descrip_tk: descrip_tk,
  fecha_reg: fecha_reg,
  fecha_ini_sop: fecha_ini_sop,
  fecha_fin_sop: fecha_fin_sop,
  tiempo_calc_sop: tiempo_calc_sop,
  tiempo_diferencial: tiempo_diferencial,
  tiempo_real_sop: tiempo_real_sop,
  estatus: estatus,
});

const getTicketSchema = Joi.object({
  id_ticket: id_ticket.required(),
});

const queryTicketSchema = Joi.object({
  limit,
  offset,
  idemp,
  rol,
  idclient,
  tracking,
});

module.exports = {
  createTicketSchema,
  updateTicketSchema,
  getTicketSchema,
  queryTicketSchema,
};
