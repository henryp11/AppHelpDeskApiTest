const bcrypt = require("bcrypt");

// Lo utilizo como función asyncrona porque se devuelve una promesa
async function hashPass() {
  const myPass = "Admin123*";
  const hash = await bcrypt.hash(myPass, 10); //Se especifica el número de saltos para encriptar
  console.log(hash);
}

async function verifyPass() {
  const myPass = "Admin123*";
  const hash = "$2b$10$ywDyxinJSvo8qyKlx.xzLu4FsMiez6JllppC0ScPOGT3FF87b8Yra";
  const isMatch = await bcrypt.compare(myPass, hash);
  console.log(isMatch);
}

hashPass();
verifyPass();
