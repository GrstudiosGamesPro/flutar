const fs = require("fs");
const path = require("path");

const lexer = require("./lexer.js");
const parser = require("./parsers.js");
const executor = require("./executer.js");

function read_file(ruta) {
  try {
    const data = fs.readFileSync(ruta, "utf8");
    return data;
  } catch (err) {
    console.error("Error al leer el archivo:", err);
    return null;
  }
}

function buscarArchivos(dir, ext, archivosEncontrados = []) {
  const archivos = fs.readdirSync(dir);

  archivos.forEach((archivo) => {
    const rutaArchivo = path.join(dir, archivo);

    if (fs.statSync(rutaArchivo).isDirectory()) {
      buscarArchivos(rutaArchivo, ext, archivosEncontrados);
    } else {
      if (path.extname(archivo) === ext) {
        archivosEncontrados.push(rutaArchivo);
      }
    }
  });

  return archivosEncontrados;
}

const directorioInicial = "scripts/";

const extension = ".flutar";

const archivosEncontrados = buscarArchivos(directorioInicial, extension);

function start_flutar() {
  const nombreCarpeta = "scripts";

  fs.mkdir(nombreCarpeta, (error) => {
    if (error) {
      console.error("¡Hubo un error al crear la carpeta!");
    } else {
      console.log("¡Carpeta creada exitosamente!");
    }
  });

  archivosEncontrados.forEach((archivo) => {
    const code = read_file(archivo);

    const tokensFound = lexer(code);
    const parsedStatements = parser(tokensFound);
    executor(parsedStatements);
  });
}

module.exports = start_flutar;
