const jwt = require("jsonwebtoken");

//Secret es la llave secreta, esto debería estar en una variable de entorno no en código y solo
//el backend la debe conocer
const secret = "Yakuza";
//Lo que se encriptará dentro del token, se puede enviar cualquier parámetro a validar
//Pero obligatoriamente requiere el sub que es el identificador del token
const payload = {
  sub: 1,
  role: "cliente",
};

function signToken(payload, secret) {
  return jwt.sign(payload, secret);
}

const token = signToken(payload, secret);
console.log(token);
