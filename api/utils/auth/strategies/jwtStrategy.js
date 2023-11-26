/**
 * Funciones para utilizar estrategia local de la librería passport
 * @module Passport_JWT */

const { Strategy, ExtractJwt } = require('passport-jwt'); //Se trae la estrategía y extract indicará de donde extraear el JWT
const { config } = require('../../../../config/config');

//El nombre de estos atributos y funciones usadas debe ser tal cual
/** Opciones para utilizar la estrategia de passport-jwt, donde se utiliza
 * la función fromAuthHeaderAsBearerToken() para validar el token, la cual extraerá los datos del Header de una petición mediante el tipo de autenticación Bearer
 * @see https://www.passportjs.org/packages/passport-jwt/
 * @type {Object}
 * @example {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret,
}
 */
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret,
};

/** Esta estrategia se le envía como parámetros las opciones y la función callback
 * Como las opciones ya se encargan de validar el token se retorna el done() directamente
 * @example
 * new Strategy(options, (payload, done) => {
  return done(null, payload);
});
 */
const JwtStrategy = new Strategy(options, (payload, done) => {
  return done(null, payload);
});

module.exports = JwtStrategy;
