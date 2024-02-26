const tokens = [
    { name: 'NUMBER', regex: /\d+/ },
    { name: 'STRING', regex: /"(.*?)"/ },
    { name: 'VAR', regex: /lex/ },
    { name: 'PRINT', regex: /log/ },
    { name: 'CONSOLETEST', regex: /see_console/ },
    { name: 'RETURN', regex: /return/ },
    { name: 'FUNCTION', regex: /fun\s*=>/ },
    { name: 'IDENTIFIER', regex: /[a-zA-Z][a-zA-Z0-9]*/ },
    { name: 'LPAREN', regex: /\(/ },
    { name: 'RPAREN', regex: /\)/ },
    { name: 'LBRACE', regex: /</ },
    { name: 'RBRACE', regex: />/ },
    { name: 'EQUALS', regex: /:/ },
    { name: 'SEMICOLON', regex: /;/ },
    { name: 'COMMA', regex: /,/ },
    { name: 'PLUS', regex: /\+/ },       // Suma
    { name: 'MINUS', regex: /-/ },       // Resta
    { name: 'MULTIPLY', regex: /\*/ },   // Multiplicación
    { name: 'DIVIDE', regex: /\// },     // División    { name: 'PARAM', regex: /param/ }, // Token para representar los parámetros de la función
    { name: 'WHITESPACE', regex: /\s+/, ignore: true },
];

module.exports = tokens;