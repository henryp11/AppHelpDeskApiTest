const bcrypt = require("bcrypt");
const boom = require("@hapi/boom");
const UserService = require("./usersService");
const service = new UserService();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const { config } = require("../../config/config");

class AuthService {
  //Servicio para obtener usuario por su email y password
  async getUser(email, password) {
    const user = await service.findByEmail(email);
    if (!user) {
      //Aqui no uso done porque es función de Strategy de la librería de passport
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

  //Servicio para firmar token
  signToken(user) {
    //Preparo información para armar token
    //el "user" vendrá de la ruta de la petición
    const payload = {
      sub: user.id_user,
      perfil: user.rol,
      status: user.estatus,
      //idCliente: user.personalEmp.id_per,
      // idEmp: user.personalEmp.id_emp,
      // vigenciaPlan: user.personalEmp.empresa.planMant,
    };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: "1h" });

    return { user, token };
  }

  //Función que se reutilizará para otro tipo de enviós de correo
  async sendMail(infoMail) {
    //CreateTransport(), función de nodemail
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
    return { message: "Correo enviado con éxito!!" };
  }
  async sendRecoveryMail(email) {
    // Primero busco si el usuario existe previamente por su email
    const user = await service.findByEmail(email);
    console.log({ userUp: user });
    if (!user) {
      throw boom.unauthorized();
    }
    //Genero token para recuperar contraseña
    const payload = { sub: user.id_user };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: "15min" });
    //El link se enviará a la vista del frontend para que recupere la contraseña
    //En el cual se enviará el token.
    const link = `http://myfrontend.com/recovery?token=${token}`;

    //Uso la función de update del modelo de usuario para actualizar
    //el nuevo campo creado con la infomración de token y almacenarlo en la BD
    await service.update(user.id_user, { recovery_token: token });

    const mail = {
      from: `${config.emailSender}`,
      to: `${user.mail}`, //Si se encuentra el usuario extraigo su email del objeto
      subject: "Recuperación de Contraseña para app de Soporte Capacity-Soft",
      html: `<b>Para recuperar tu contraseña, ingresa al siguiente link <br/> 
      <a href=${link}>${link}</a></br>`,
    };

    const response = await this.sendMail(mail);
    return response;
  }

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
      return { message: "Contraseña cambiada con éxito" };
    } catch (error) {
      throw boom.unauthorized();
    }
  }
}
module.exports = AuthService;
