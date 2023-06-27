const express = require("express");
const cors = require("cors");
const routerApi = require("./routes"); //Solo ingreso a la carpeta de rutas, el index.js al ser estándar se leerá directamente sin necesidad de especificarlo

const {
  logErrors,
  errorHandler,
  boomErrorHandler,
} = require("./middlewares/errorHandle");
const app = express(); //Express es un método que me va a crear la aplicación
const port = 3000;

app.use(express.json()); // Middleware para habilitar las peticiones en JSON

//Lista blanca para añadir los CORS
const whiteList = ["http://localhost:8080", "https://mydominioexterno.com"];
//Opciones a enviar en el cors con una función que evalua los origenes y devuelve un callback para permitir
//o bloquear acceso
const options = {
  origin: (origin, callback) => {
    //EL or !origin es para que no bloquee el propio localhost
    if (whiteList.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Acceso no permitido"));
    }
  },
};

//app.use(cors()); //Invocando de esta forma estoy habilitando conexiones desde cualquier dominio
app.use(cors(options)); //Solo dominios permitidos

//Levanto mi servidor y envío un respuesta, usando la ruta deseada
app.get("/", (req, res) => {
  res.send("Hola desde el servidor de express");
});

routerApi(app);
//LLamo a los middleware, recordar ponerlos en el orden de la secuenciar que quiero
app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);

//PReparo el puerto donde se escuchará
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
