/** Se requiere la librería de passport */
const passport = require('passport');

//Aquí declaro todas las estrategias de auth que voy a utilizar
const LocalStrategy = require('./strategies/localStrategy');

//Estrategia para validar token Jwt una vez logueado.
const JwtStrategy = require('./strategies/jwtStrategy');

passport.use(LocalStrategy);
passport.use(JwtStrategy);
