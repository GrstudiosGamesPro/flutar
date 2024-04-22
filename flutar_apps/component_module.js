const app = require("./flutar_html.js");

function obtenerURL(texto) {
  let inicio = texto.indexOf("='") + 2;
  let fin = texto.lastIndexOf("'");
  return texto.substring(inicio, fin);
}

function verify_component(texto) {
  const regex = /<(\w+)>(.*?)<\/\1>/g;
  let match;
  const components = [];

  while ((match = regex.exec(texto)) !== null) {
    const component = match[1];
    const content = match[2];

    components.push({ component, content, index: match.index });
  }

  if (components.length === 0) {
    app.sendToRender(texto);
    return;
  }

  components.sort((a, b) => a.index - b.index);

  components.forEach(({ component, content }) => {
    console.log("Component type: " + component);

    if (component === "navbar") {
      navbar_component(content.split(", "));
    } else {
      app.sendToRender(content);
    }
  });
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
