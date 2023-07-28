const { Strategy } = require("passport-local");
const AuthService = require("../../../services/authService");
const service = new AuthService();
//Creo nuevo constructor para la estrategia deseada
//Requiere el nombre de usuario, pass y una función  Done que indica cuando todo es OK
const LocalStrategy = new Strategy(
  {
    usernameField: "mail",
    passwordField: "clave",
  },
  async (email, password, done) => {
    try {
      const user = await service.getUser(email, password);
      //Si todo paso y está ok procedo a enviar la función done sin error
      //y el valor de retorno
      done(null, user);
    } catch (error) {
      done(error, false); //Se envía false para indicarle a la función que no paso la validación
    }
  }
);

module.exports = LocalStrategy;
