const start_flutar = require('./main.js')
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Parsea las solicitudes con formato JSON
app.use(bodyParser.json());

let additionalHtml = '';

app.post('/agregar-html', (req, res) => {
    const { html } = req.body;
    additionalHtml += html;
    res.send('HTML agregado correctamente');
});

app.get('/', (req, res) => {
    const html = `
    <html>
      <body>
        ${additionalHtml}
      </body>
    </html>
  `;
    res.send(html);
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

start_flutar();