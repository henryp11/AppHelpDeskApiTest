const Joi = require('joi');

// const id = Joi.string().uuid(); //No se le coloca como requerido ya que lo autogenero
const id_user = Joi.number();
const username = Joi.string().alphanum().min(4).max(20);
const mail = Joi.string().email().max(100);
const password = Joi.string().alphanum().min(6).max(100);
const rol = Joi.string().alphanum().max(10);
const estatus = Joi.boolean();

const createUserSchema = Joi.object({
  id_user: id_user,
  username: username.required(),
  mail: mail.required(),
  password: password.required(),
  rol: rol,
  estatus: estatus,
});

const updateUserSchema = Joi.object({
  id_user: id_user,
  username: username,
  mail: mail,
  password: password,
  rol: rol,
  estatus: estatus,
});

const getUserSchema = Joi.object({
  id_user: id_user.required(),
});

const mailUserSchema = Joi.object({
  mail: mail,
});

module.exports = {
  createUserSchema,
  updateUserSchema,
  getUserSchema,
  mailUserSchema,
};
