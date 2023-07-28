const jwt = require("jsonwebtoken");

//Secret es la llave secreta, esto debería estar en una variable de entorno no en código y solo
//el backend la debe conocer
const secret = "Yakuza";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInJvbGUiOiJjbGllbnRlIiwiaWF0IjoxNjg5MTAxNDY2fQ.Bb_B3QxAB_Y5_hw9UdSOADLpD2h7nnIZQGQoTTClXZs";

//Solo se requiere el token enviado y la llave para verificar
function verifyToken(token, secret) {
  return jwt.verify(token, secret);
}

const payload = verifyToken(token, secret);
console.log(payload);
