const passport = require("passport");

// Aquí declaro todas las estrategias de auth que voy a utilziar
const LocalStrategy = require("./strategies/localStrategy");
const JwtStrategy = require("./strategies/jwtStrategy");

passport.use(LocalStrategy);
passport.use(JwtStrategy);
