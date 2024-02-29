const tokens = [
    // Operadores booleanos
    { name: 'OPERATOR', regex: /(&&|\|\||!|<=|>=|=|<|>)/ },

    // Palabras clave booleanas
    { name: 'TRUE', regex: /true/ },
    { name: 'FALSE', regex: /false/ },

    //CONDICIONALES
    { name: 'IF', regex: /if/ },
    { name: 'ELSE', regex: /else/ },

    //LOOPS
    { name: 'FOR', regex: /for/ },

    //FLUTAR DEBUG
    { name: 'HIFLUTAR', regex: /hi_flutar/ },


    { name: 'NUMBER', regex: /-?\d+(\.\d+)?|\.\d+/ },
    { name: 'STRING', regex: /"(.*?)"/ },
    { name: 'VAR', regex: /lex/ },
    { name: 'PRINT', regex: /log/ },
    { name: 'CONSOLETEST', regex: /see_console/ },
    { name: 'RETURN', regex: /<return>/ },
    { name: 'FUNCTION', regex: /fun\s*=>/ },
    { name: 'RENDER', regex: /render\s*=>/ },
    { name: 'IDENTIFIER', regex: /(?:[a-zA-Z][a-zA-Z0-9]*|fun)/ },
    { name: 'LPAREN', regex: /\(/ },
    { name: 'RPAREN', regex: /\)/ },
    { name: 'LBRACE', regex: /{/ },
    { name: 'RBRACE', regex: /}/ },
    { name: 'EQUALS', regex: /:/ },
    { name: 'DOUBLEEQUALS', regex: /::/ },
    { name: 'SEMICOLON', regex: /;/ },
    { name: 'COMMA', regex: /,/ },
    { name: 'PLUS', regex: /\+/ },
    { name: 'MINUS', regex: /-/ },
    { name: 'MULTIPLY', regex: /\*/ },
    { name: 'DIVIDE', regex: /\// },
    { name: 'POWER', regex: /`/ },
    { name: 'PERCENTAGE', regex: /%/ },

];

module.exports = tokens;
