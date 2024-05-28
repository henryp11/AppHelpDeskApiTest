const { Strategy } = require('passport-local'); //Se utiliza la libreria de passport-local trayendo la clase Strategy
const AuthService = require('../../../services/authService');
const service = new AuthService();

const LocalStrategy = new Strategy(
  {
    usernameField: 'mail',
    passwordField: 'clave',
  },
  async (email, password, done) => {
    try {
      const user = await service.getUser(email, password);
      //Si todo pasó y está ok procedo a enviar la función done sin error
      //y el valor de retorno, en este caso la variable user con los datos recuperados
      done(null, user);
    } catch (error) {
      done(error, false); //Se envía false para indicarle a la función que no paso la validación
    }
  }
);

module.exports = LocalStrategy;
