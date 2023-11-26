/**
 * Funciones para utilizar estrategia local de la librería passport
 * @module Passport_Local */
const { Strategy } = require('passport-local'); //Se utiliza la libreria de passport-local trayendo la clase Strategy
/** Importo los servicios de autorización: {@link module:Servicios_Autorizacion}*/
const AuthService = require('../../../services/authService');
/** Se crea el objeto de tipo AuthService para usar las funciones de la clase en {@link module:Servicios_Autorizacion~AuthService} */
const service = new AuthService();

/** Creo nuevo constructor para la estrategia deseada
 * Requiere como parametros un objeto con los datos a validar, en este caso el nombre de usuario determinado por el correo y la contraseña
 * Y como segundo parámetro una función asíncrona, la cual requerirá un email y password así como una función de validación "done" propia de Passport, que indica cuando todo es OK
 *@see https://www.passportjs.org/concepts/authentication/strategies/
 */
const LocalStrategy = new Strategy(
  {
    usernameField: 'mail',
    passwordField: 'clave',
  },
  async (email, password, done) => {
    try {
      const user = await service.getUser(email, password);
      //Si todo pasó y está ok procedo a enviar la función done sin error
      //y el valor de retorno, en este caso al variable user con los datos recuperados
      done(null, user);
    } catch (error) {
      done(error, false); //Se envía false para indicarle a la función que no paso la validación
    }
  }
);

module.exports = LocalStrategy;
