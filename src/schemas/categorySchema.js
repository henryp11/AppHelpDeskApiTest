const Joi = require('joi');

const id_cat = Joi.string().alphanum().min(3).max(3);
const descrip = Joi.string().min(3).max(40);
const estatus = Joi.boolean();
//Para Paginación
const offset = Joi.number().integer();
const limit = Joi.number().integer();

const createCategSchema = Joi.object({
  id_cat: id_cat,
  descrip: descrip.required(),
  estatus: estatus,
});

const updateCategSchema = Joi.object({
  id_cat: id_cat,
  descrip: descrip,
  estatus: estatus,
});

const getCategSchema = Joi.object({
  id_cat: id_cat.required(),
});

const queryCategSchema = Joi.object({
  limit,
  offset,
});

module.exports = {
  createCategSchema,
  updateCategSchema,
  getCategSchema,
  queryCategSchema,
};
