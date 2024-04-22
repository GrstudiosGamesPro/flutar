const app = require("./flutar_html.js");

function obtenerURL(texto) {
  let inicio = texto.indexOf("='") + 2;
  let fin = texto.lastIndexOf("'");
  return texto.substring(inicio, fin);
}

function verify_component(texto) {
  const regex = /<(\w+)>(.*?)<\/\1>|<(\w+)>([^<]*)/g;
  let match;
  let lastIndex = 0;

  while ((match = regex.exec(texto)) !== null) {
    const component = match[1] || match[3];
    const content = match[2] || match[4];
    const index = match.index;

    if (index > lastIndex) {
      app.sendToRender(texto.slice(lastIndex, index));
    }

    if (component === "navbar") {
      const cleanedContent = content.replace(/^"/, "").replace(/"$/, "");
      navbar_component(cleanedContent.split(", "));
    } else {
      app.sendToRender(content);
    }

    lastIndex = index + match[0].length;
  }

  if (lastIndex < texto.length) {
    app.sendToRender(texto.slice(lastIndex));
  }
}

function navbar_component(text) {
  const navbarItems = text.map((item) => {
    const [label, url] = item.split("='");
    const cleanUrl = url.replace(/'$/, "");
    return `<li class='nav_li'">
              <a style="text-decoration: none; color: white;" href="${cleanUrl}">${label}</a>
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
