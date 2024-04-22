const app = require("./flutar_html.js");

function obtenerURL(texto) {
  let inicio = texto.indexOf("='") + 2;
  let fin = texto.lastIndexOf("'");
  return texto.substring(inicio, fin);
}

function verify_component(page, texto) {
  const regex = /<(\w+)>(.*?)<\/\1>|<(\w+)>([^<]*)/g;
  let match;
  let lastIndex = 0;

  while ((match = regex.exec(texto)) !== null) {
    const component = match[1] || match[3];
    const content = match[2] || match[4];
    const index = match.index;

    const replacedContent = content.replace(/\(([^)]+)\)/g, (match, p1) => {
      try {
        return eval(p1).toString();
      } catch (error) {
        return match;
      }
    });

    if (index > lastIndex) {
      app.sendToRender(page, texto.slice(lastIndex, index));
    }

    if (component === "navbar") {
      let cleanedContent = replacedContent.replace(/^"/, "").replace(/"$/, "");

      if (cleanedContent.endsWith("'")) {
        cleanedContent = cleanedContent.slice(0, -1);
      }

      setTimeout(() => {
        navbar_component(page, cleanedContent.split(", "));
      }, 0.1);
    } else {
      setTimeout(() => {
        app.sendToRender(page, replacedContent);
      }, 0.1);
    }

    lastIndex = index + match[0].length;
  }

  if (lastIndex < texto.length) {
    app.sendToRender(page, texto.slice(lastIndex));
  }
}

function navbar_component(page, text) {
  const navbarItems = text.map((item) => {
    const [label, url] = item.split("=");
    return `<li class='nav_li'>
              <a href="${url.trim()}">${label.trim()}</a>
            </li>`;
  });

  const navbar = `
  <nav class='nav_manager'>
  <div class='nav_logo'>
    <h1>FLUTAR</h1>
  </div>
  
    ${navbarItems.join("")}
  </nav>
  `;

  app.sendToRender(page, navbar);
}

module.exports = { verify_component };
