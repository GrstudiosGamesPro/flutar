const fs = require('fs');
const lexer = require('./lexer.js');
const parser = require('./parsers.js');
const executor = require('./executer.js');

function read_file(ruta) {
    try {
        const data = fs.readFileSync(ruta, 'utf8');
        return data;
    } catch (err) {
        console.error('Error al leer el archivo:', err);
        return null;
    }
}

const code = read_file("script.flutar");

const tokensFound = lexer(code);
const parsedStatements = parser(tokensFound);
executor(parsedStatements);