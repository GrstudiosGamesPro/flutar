const app = require("./flutar_html.js");

function obtenerURL(texto) {
  let inicio = texto.indexOf("='") + 2;
  let fin = texto.lastIndexOf("'");
  return texto.substring(inicio, fin);
}

function verify_component(page, texto) {
  const regex = /<(\w+)([^>]*)>(.*?)<\/\1>|<(\w+)([^>]*)\/>/g;
  let match;
  let lastIndex = 0;

  while ((match = regex.exec(texto)) !== null) {
    const component = match[1] || match[4];
    const attributes = match[2] || match[5];
    const content = match[3];

    const attributeRegex = /(\w+)=["']([^"']+)["']/g;
    let attributeMatch;
    const attributeMap = {};

    while ((attributeMatch = attributeRegex.exec(attributes)) !== null) {
      attributeMap[attributeMatch[1]] = attributeMatch[2];
    }

    console.log("Attributes for component", component, ":", attributeMap);

    const replacedContent = content.replace(/\(([^)]+)\)/g, (match, p1) => {
      try {
        return eval(p1).toString();
      } catch (error) {
        return match;
      }
    });

    if (match.index > lastIndex) {
      app.sendToRender(page, texto.slice(lastIndex, match.index));
    }

    if (component === "navbar") {
      let cleanedContent = replacedContent.replace(/^"/, "").replace(/"$/, "");
      if (cleanedContent.endsWith("'")) {
        cleanedContent = cleanedContent.slice(0, -1);
      }
      setTimeout(() => {
        navbar_component(page, cleanedContent.split(", "));
      }, 0.1);
    } else if (component === "counter") {
      let cleanedContent = replacedContent.replace(/^"/, "").replace(/"$/, "");
      if (cleanedContent.endsWith("'")) {
        cleanedContent = cleanedContent.slice(0, -1);
      }

      let initialValue = cleanedContent.trim(); // Eliminamos espacios en blanco alrededor del contenido

      setTimeout(() => {
        if (
          attributeMap.hasOwnProperty("auto") &&
          attributeMap["auto"] === "increment"
        ) {
          // Si el atributo auto es incremento
          counter_component(
            page,
            cleanedContent.split(", "),
            true,
            initialValue
          );
        } else if (
          attributeMap.hasOwnProperty("auto") &&
          attributeMap["auto"] === "decrement"
        ) {
          counter_component(
            page,
            cleanedContent.split(", "),
            false,
            initialValue
          );
        } else {
          counter_component(
            page,
            cleanedContent.split(", "),
            undefined,
            initialValue
          );
        }
      }, 0.1);
    } else {
      setTimeout(() => {
        app.sendToRender(page, replacedContent);
      }, 0.1);
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < texto.length) {
    app.sendToRender(page, texto.slice(lastIndex));
  }
}

function counter_component(page, text, counter_Type, initialValue = 0) {
  const counterId = "counter_" + Math.random().toString(36).substr(2, 9); // Generar un ID aleatorio para el contador
  const incrementButtonId = "button_" + Math.random().toString(36).substr(2, 9); // Generar un ID aleatorio para el botón de incrementar
  const decrementButtonId = "button_" + Math.random().toString(36).substr(2, 9); // Generar un ID aleatorio para el botón de decrementar
  const h1Id = "h1_" + Math.random().toString(36).substr(2, 9); // Generar un ID aleatorio para el h1 del contador

  function updateCounter() {
    const counterHTML = `
            <div class="counter-container">
            <h1 class="counter-value" id="${h1Id}">${initialValue}</h1>
            <button class="counter-button increment-button" id="${incrementButtonId}">+</button>
            <button class="counter-button decrement-button" id="${decrementButtonId}">-</button>
        </div>


          <script>
              let count = ${initialValue};
              let type_counter = ${counter_Type};

              function increment() {
                  count++;
                  document.getElementById("${h1Id}").innerText = count;
              }
              
              function decrement() {
                  count--;
                  document.getElementById("${h1Id}").innerText = count;
              }
              
              function getCount() {
                  return count;
              }

              document.getElementById("${incrementButtonId}").addEventListener("click", () => {
                  increment();
              });

              document.getElementById("${decrementButtonId}").addEventListener("click", () => {
                  decrement();
              });

              if (type_counter !== undefined){
                if (type_counter === true){
                  setInterval(() => {increment()}, 1000);
                }else{
                  setInterval(() => {decrement()}, 1000);
                }
              }
          </script>
      `;

    app.sendToRender(page, counterHTML);
  }

  let count = 0; // Inicializar count

  updateCounter();
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
