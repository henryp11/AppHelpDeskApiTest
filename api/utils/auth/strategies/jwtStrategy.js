//Se trae la estrategía y extract indicará de donde extraear el JWT
const { Strategy, ExtractJwt } = require("passport-jwt");
const { config } = require("../../../../config/config");

//El nombre de estas atributos y funciones usadas debe ser tal cual
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret,
};

//Esta estrategia se le envía como parámetros las optiones y la función callback
//Como las opciones ya se encargan de validar el token se retorna el done() directamente
const JwtStrategy = new Strategy(options, (payload, done) => {
  return done(null, payload);
});

module.exports = JwtStrategy;
