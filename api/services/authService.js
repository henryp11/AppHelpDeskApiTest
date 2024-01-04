/** Servicios de autorización
 * @module Servicios_Autorizacion
 */
const bcrypt = require('bcrypt');
const boom = require('@hapi/boom');
/**Requiere los servicios de usuarios: {@link module:Servicios_Usuarios} */
const UserService = require('./usersService');
const service = new UserService();
const jwt = require('jsonwebtoken'); /** Requiere la dependencia jsonwebtoken para el uso de tokens */
const nodemailer = require('nodemailer'); /** Requiere la dependencia nodemailer para utilizar servidor de correos */
const { config } = require('../../config/config');

/** Clase para ejecutar los diferentes servicios de Autenticación */
class AuthService {
  /**
   * Servicio para obtener usuario por su email y password,
   * utiliza la función findByEmail() desde: {@link module:Servicios_Usuarios~UsersServices#findByEmail}
   * @param {string} email email/usuario para iniciar sesión
   * @param {string} password contraseña
   * @return {Object} Información de todo el usuario
   */
  async getUser(email, password) {
    const user = await service.findByEmail(email);
    if (!user) {
      //Aqui no uso done() porque es función de Strategy de la librería de passport
      //done(boom.unauthorized(), false);
      throw boom.unauthorized();
    }
    //Si pasa la validación procederé a comparar el password enviado con el hash encriptado en la DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw boom.unauthorized();
    }
    delete user.dataValues.password; //Quito password en la respuesta a enviar
    return user;
  }

  /** Servicio para firmar token, realiza el firmado del token mediante la función sign() de JWT
   * @see https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback
   * @param {Object} user Datos del usuario registrado, de donde se extraerá su id_user, rol y estatus
   * @return {Object} Información de todo el usuario
   * @return {string} Token asignado al usuario
   */
  signToken(user) {
    //Preparo información para armar token, el objeto "user" vendrá de la ruta de la petición
    //en el caso de datos de la empresa (idEmp, nameEmp, havePlan), puede darse el caso de que aun no haya sido asignado
    //Un usuario a su respectiva empresa (ejemplo, por migración inicial de datos o un usuario que solo se registro en el sistema pero no se asigno a ninguna empresa)
    //Por tal motivo se evalua que la propiedad user.personalEmp no sea nula, ya que el API envía en su consulta esa información, pero si no existem lo manda como NULL
    //de esta forma puedo identificar los datos de la empresa del usuario se ingrese al sistema mediante su token y realizar varias acciones dependiendo del caso
    const payload = {
      sub: user.id_user,
      perfil: user.rol,
      status: user.estatus,
      username: user.username,
      mail: user.mail,
      idEmp:
        user.personalEmp === null ? 'SIN_EMPRESA' : user.personalEmp.id_emp,
      nameEmp:
        user.personalEmp === null
          ? 'SIN_EMPRESA'
          : user.personalEmp.empresa.nombre_emp,
      idClient:
        user.personalEmp === null ? 'SIN_EMPRESA' : user.personalEmp.id_per,
      havePlan:
        user.personalEmp === null ? false : user.personalEmp.empresa.planMant,
      agSop: user.agentesSop === null ? '-' : user.agentesSop.id_agente,
    };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' });

    return { user, token };
  }

  //Función que se reutilizará para otro tipo de enviós de correo
  /** Servicio para enviar correos usando el servicio de nodeMailer, se la invocará dependiendo del tipo de correo a enviar
   * @see https://nodemailer.com/about/#example
   * @param {Object} infoMail Información del correo a enviar
   * @return {{string}} Objeto con un mensaje de confirmación
   */
  async sendMail(infoMail) {
    //CreateTransport() --> función de nodemail
    const transporter = nodemailer.createTransport({
      host: config.emailSenderHost,
      secure: true,
      port: config.emailSenderPortSSL,
      auth: {
        user: config.emailSender,
        pass: config.emailSenderPass,
      },
    });

    await transporter.sendMail(infoMail);
    return { message: 'Correo enviado con éxito!!' };
  }

  /** Función para enviar correo de recuperación de contraseña, se genera un token temporal de 15 minutos para la recuperación
   * @param {string} email Email a buscar con el servicio de usuarios findByEmail de la clase {@link module:Servicios_Usuarios~UsersServices#findByEmail}
   * @return {response} Objeto con la respuesta del envío, es decir el correo de recuperación
   */
  async sendRecoveryMail(email) {
    // Primero busco si el usuario existe previamente por su email
    const user = await service.findByEmail(email);
    console.log({ userUp: user });
    if (!user) {
      throw boom.unauthorized();
    }
    //Genero token para recuperar contraseña
    const payload = { sub: user.id_user };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '15min' });
    //El link se enviará a la vista del frontend para que recupere la contraseña
    //En el cual se enviará el token.
    // const link = `http://myfrontend.com/recovery?token=${token}&mail=${email}`;
    const link = `http://localhost:3001/recovery/changepass?rectk=${token}&mail=${email}`;

    //Uso la función de update() del modelo de usuario para actualizar
    //el nuevo campo creado con la información del token y almacenarlo en la BD
    await service.update(user.id_user, { recovery_token: token });

    const mail = {
      from: `${config.emailSender}`,
      to: `${user.mail}`, //Si se encuentra el usuario extraigo su email del objeto
      subject: 'Recuperación de Contraseña para app de Soporte Capacity-Soft',
      html: `<div>Has realizado una solicitud para recuperación de tu contraseña. <br/> 
      Por favor <b>ingresa al siguiente enlace para realizar el cambio de contraseña:<b>
      <b><a href=${link}>${link}</a></b></div>`,
    };

    const response = await this.sendMail(mail);
    return response;
  }

  /** Función para cambiar la contraseña del usuario, se utiliza la función verify() de jwt para verificar
   * el token de recuperación que coincida con el token guardado a la BD para poder cambiar la contraseña.
   * Se utilizan los métodos de la clase de servicios de usuario,
   * filterId: {@link module:Servicios_Usuarios~UsersServices#filterId} y update: {@link module:Servicios_Usuarios~UsersServices#update}
   * @see https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
   * @param {string} token Token de la sesión activa para el cambio de contraseña
   * @param {string} newPassword Nueva contraseña
   * @return {Object} Objeto con la respuesta de confirmación de cambio de contraseña
   */
  async changePassword(token, newPassword) {
    try {
      // 1. Verifico el token firmado
      const payload = jwt.verify(token, config.jwtSecret);
      // 2. Como el token debe tener el id del usuario, procedo a buscarlo
      const user = await service.filterId(payload.sub); //El sub del payload contien el id_user
      // 3. Verifico si el token recuperado es el mismo que esta en la BD
      if (user.recovery_token !== token) {
        throw boom.unauthorized();
      }
      // 4. Aplico un hash a la nueva contraseña
      const hash = await bcrypt.hash(newPassword, 10);
      // 5. Procedo con el update, anulando el token de recuperación y cambiando el password
      await service.update(user.id_user, {
        recovery_token: null,
        password: hash,
      });
      return { message: 'Contraseña actualizada con éxito' };
    } catch (error) {
      throw boom.unauthorized();
    }
  }
}
module.exports = AuthService;
