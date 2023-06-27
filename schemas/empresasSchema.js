const Joi = require("joi");

//Realizo un esquema para cada campo para validar su formato
// se debe empezar por indicar el tipo de campo y luego la validación

const id = Joi.string().uuid(); //No se le coloca como requerido ya que lo autogenero
const name = Joi.string().alphanum().min(3).max(30);
const descrip = Joi.string().min(3).max(30);
const price = Joi.number().integer().min(10);

//Creo el esquema como un Objeto, mando cada campo, donde tambien
//Puedo colocar si son campos requeridos o no, por lo que solo puedo enviar los requeridos
//De tal forma que puedo crear una validación para cada acción de CRUD
const createEmpresaSchema = Joi.object({
  name: name.required(),
  descrip: descrip.required(),
});

const updateEmpresaSchema = Joi.object({
  name: name,
  descrip: descrip,
});

const getEmpresaSchema = Joi.object({
  id: id.required(),
});

module.exports = { createEmpresaSchema, updateEmpresaSchema, getEmpresaSchema };
