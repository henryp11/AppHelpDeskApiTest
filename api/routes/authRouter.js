const express = require('express');
const passport = require('passport');
const validatorHandler = require('../middlewares/validatorHandler');
const AutService = require('../services/authService');
const service = new AutService();
const { mailUserSchema } = require('../schemas/usersSchema');

const router = express.Router();
//Esta ruta del login generará el TOKEN principal, donde armaré todo el payload
router.post(
  '/login',
  //En la función authenticate se inidca la estrategía a utilizar
  //el parámetro de "session" es para indicar que de momento no requiero almacenar sesiones/cookies
  passport.authenticate('local', { session: false }),
  async (req, res, next) => {
    try {
      //Preparo información para armar token y usar el servicio de firmado
      const user = req.user;
      //Al pasar el middleware de autenticación, este envia el objeto "user" cuando pasa las validaciones,
      //por eso lo utilizo en la respuesta de la petición
      res.json(service.signToken(user));
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/recovery',
  validatorHandler(mailUserSchema, 'body'),
  async (req, res, next) => {
    try {
      //Preparo información para armar token
      const { mail } = req.body;
      const response = await service.sendRecoveryMail(mail);
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/change-password', async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    const response = await service.changePassword(token, newPassword);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
