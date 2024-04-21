const app = require("./flutar_html.js");

function obtenerURL(texto) {
  let inicio = texto.indexOf("='") + 2;
  let fin = texto.lastIndexOf("'");
  return texto.substring(inicio, fin);
}

function verify_component(texto) {
  const regex = /<(\w+)>(.*?)<\/\1>/;
  const match = texto.match(regex);

  const component = match[1];

  const existComponent = new RegExp(
    `<${component}>["'].*?["']<\/${component}>`
  ).test(texto);

  console.log(texto);

  let textComponent = match[2];
  var navarWt = textComponent.slice(1, -1);
  let txt = navarWt.replace(new RegExp(`<\/?${component}>`, "g"), "");
  var text = txt.split(", ");

  console.log("Component type: " + component);

  if (component == "navbar") {
    navbar_component(text);
  } else {
    app.sendToRender(texto);
  }

  return { text, existComponent };
}

function navbar_component(text) {
  const navbarItems = text.map((item) => {
    const [label, url] = item.split("='");
    return `<li style="display: inline; margin-right: 20px;">
              <a style="text-decoration: none; color: white;" href="${url.trim()}">${label.trim()}</a>
            </li>`;
  });

  const navbarStyle = `
    background-color: #11101d;
    color: white;
    padding: 10px;
    font-family: Arial, sans-serif;
    display: flex;
    justify-content: center;
  `;

  const navbar = `
  <nav style="${navbarStyle}">
    ${navbarItems.join("")}
  </nav>
  `;

  app.sendToRender(navbar);
}

module.exports = { verify_component };
