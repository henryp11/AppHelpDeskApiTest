/** Se requiere la librería de passport */
const passport = require('passport');

//Aquí declaro todas las estrategias de auth que voy a utilizar
/**Estrategia para validar usuario y contraseña en base de datos. {@link module:Passport_Local}*/
const LocalStrategy = require('./strategies/localStrategy');

/**Estrategia para validar token Jwt una vez logueado. {@link module:Passport_JWT}*/
const JwtStrategy = require('./strategies/jwtStrategy');

passport.use(LocalStrategy);
passport.use(JwtStrategy);
