const http = require("http");

function hi_flutar(val) {
  const htmlToAdd = "<h1>Hi! im flutar</h1>";

  const data = JSON.stringify({ html: htmlToAdd });

  const options = {
    hostname: "localhost",
    port: 3000,
    path: "/add",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": data.length,
    },
  };

  const req = http.request(options, (res) => {
    let responseData = "";

    res.on("data", (chunk) => {
      responseData += chunk;
    });

    res.on("end", () => {
      console.log("Respuesta del servidor:", responseData);
    });
  });

  req.on("error", (e) => {
    console.error(`Error en la solicitud: ${e.message}`);
  });

  req.write(data);
  req.end();
}

function sendToRender(pg, val) {
  const htmlToAdd = val;

  const data = JSON.stringify({ page: pg, html: htmlToAdd });

  const options = {
    hostname: "localhost",
    port: 3000,
    path: "/add",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": data.length,
    },
  };

  const req = http.request(options, (res) => {
    let responseData = "";

    res.on("data", (chunk) => {
      responseData += chunk;
    });

    res.on("end", () => {
      //console.log("Respuesta del servidor:", responseData);
    });
  });

  req.on("error", (e) => {
    console.error(`Error en la solicitud: ${e.message}`);
  });

  req.write(data);
  req.end();
}

function register_page(pagename) {
  const namepage = pagename;

  const data = JSON.stringify({ page: namepage });

  const options = {
    hostname: "localhost",
    port: 3000,
    path: "/register_new_page",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": data.length,
    },
  };

  const req = http.request(options, (res) => {
    let responseData = "";

    res.on("data", (chunk) => {
      responseData += chunk;
    });

    res.on("end", () => {
      console.log("Respuesta del servidor:", responseData);
    });
  });

  req.on("error", (e) => {
    console.error(`Error en la solicitud: ${e.message}`);
  });

  req.write(data);
  req.end();
}

function set_url(irl) {
  const newur = irl;

  const data = JSON.stringify({ irl: newur });

  const options = {
    hostname: "localhost",
    port: 3000,
    path: "/setstarturl",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": data.length,
    },
  };

  const req = http.request(options, (res) => {
    let responseData = "";

    res.on("data", (chunk) => {
      responseData += chunk;
    });

    res.on("end", () => {
      console.log("Respuesta del servidor:", responseData);
    });
  });

  req.on("error", (e) => {
    console.error(`Error en la solicitud: ${e.message}`);
  });

  req.write(data);
  req.end();
}

module.exports = { hi_flutar, sendToRender, register_page, set_url };
