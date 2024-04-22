const start_flutar = require("./main.js");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

// Parsea las solicitudes con formato JSON
app.use(bodyParser.json());

let additionalHtml = "";

app.post("/add", (req, res) => {
  const { html } = req.body;
  additionalHtml += html;
  //res.send("HTML agregado correctamente");
});

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  const cssadd = `
    <link rel="stylesheet" type="text/css" href="/css/style.css" />
  `;

  const html = `
  <head>
    ${cssadd}
  </head>
    <html>
      <body>
        ${additionalHtml}
      </body>
    </html>
  `;

  res.send(html);
});

app.use((req, res, next) => {
  res.status(404).send(`
    <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; background-color: #6b5b95;">
      <div style="text-align: center; padding: 30px; border: 2px solid #404040; background-color: #c9c9c9; border-radius: 10px;">
        <h1 style="color: #404040; font-family: Arial; font-size: 36px;">FLUTAR</h1>
        <p style="color: #404040; font-family: Arial; font-size: 20px;">No logro encontrar esta ruta.</p>
        <a href="/" style="margin-top: 30px; display: inline-block; padding: 15px 30px; background-color: #6b5b95; color: #fff; text-decoration: none; border-radius: 5px;">Regresar a la página principal</a>
      </div>
    </div>
  `);
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

start_flutar();
