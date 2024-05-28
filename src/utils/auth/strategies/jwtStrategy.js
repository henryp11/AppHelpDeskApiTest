const { Strategy, ExtractJwt } = require('passport-jwt'); //Se trae la estrategía y extract indicará de donde extraear el JWT
const { config } = require('../../../../config/config');

//El nombre de estos atributos y funciones usadas debe ser tal cual
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret,
};

const JwtStrategy = new Strategy(options, (payload, done) => {
  return done(null, payload);
});

module.exports = JwtStrategy;
