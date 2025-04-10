const Joi = require('joi');

const id_ticket = Joi.number().integer();
const id_solicitud = Joi.number().integer();
const descripcion = Joi.string();
const modulo = Joi.string().max(15);
const id_categ_supuesta = Joi.string().alphanum().min(3).max(3);
const id_categ_final = Joi.string().alphanum().min(3).max(3);
// const capturas = Joi.object({
//   id_captura: Joi.number().integer(),
//   url: Joi.string().uri(),
// });
const capturas = Joi.any();
const agente_asig = Joi.string().alphanum().min(4).max(4);
const fecha_ini_solucion = Joi.any();
const fecha_fin_solucion = Joi.any();
const solucion = Joi.string().empty();
const estatus = Joi.string().max(11);
//Para Paginación
const offset = Joi.number().integer();
const limit = Joi.number().integer();
const tracking = Joi.any();
const assigment = Joi.any();
const agent = Joi.any();

const createSolicitudSchema = Joi.object({
  id_ticket: id_ticket,
  id_solicitud: id_solicitud,
  descripcion: descripcion.required(),
  modulo: modulo,
  id_categ_supuesta: id_categ_supuesta,
  id_categ_final: id_categ_final,
  capturas: capturas,
  agente_asig: agente_asig,
  fecha_ini_solucion: fecha_ini_solucion,
  fecha_fin_solucion: fecha_fin_solucion,
  solucion: solucion,
  estatus: estatus,
});

const updateSolicitudSchema = Joi.object({
  id_ticket: id_ticket,
  id_solicitud: id_solicitud,
  descripcion: descripcion,
  modulo: modulo,
  id_categ_supuesta: id_categ_supuesta,
  id_categ_final: id_categ_final,
  capturas: capturas,
  agente_asig: agente_asig,
  fecha_ini_solucion: fecha_ini_solucion,
  fecha_fin_solucion: fecha_fin_solucion,
  solucion: solucion,
  estatus: estatus,
});

const getSolicitudSchema = Joi.object({
  id_ticket: id_ticket,
  id_solicitud: id_solicitud,
});

const querySolicitudSchema = Joi.object({
  limit,
  offset,
  tracking,
  assigment,
  agent,
});

module.exports = {
  createSolicitudSchema,
  updateSolicitudSchema,
  getSolicitudSchema,
  querySolicitudSchema,
};
