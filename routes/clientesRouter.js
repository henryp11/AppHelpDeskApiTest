const { faker } = require("@faker-js/faker");
const express = require("express");
//LLamo función para rutas de express

const router = express.Router();

//El endpoint es lo que va a continuación de la ruta a configurar en este caso clientes/
//Por lo que ya no llamo a app sino a router
router.get("/", (req, res) => {
  res.json([
    {
      id: "1721239422",
      nombre: "Empresa XYZ",
    },
    {
      id: "1721239742",
      nombre: "Empresa ZTS",
    },
  ]);
});

router.get("/:clientId", (req, res) => {
  const { clientId } = req.params;

  res.json({
    clientId,
    id: "1721239422",
    nombre: "Empresa XYZ",
  });
});

router.get("/:clientId/facturas/:idFactura", (req, res) => {
  const { clientId, idFactura } = req.params;

  res.json({
    clientId,
    idFactura,
    id: "1721239422",
    nombre: "Empresa XYZ",
  });
});

//Esto será un módulo que tendre que exportar, en este caso router
module.exports = router;
