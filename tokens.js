const tokens = [
  // Palabras clave booleanas
  { name: "TRUE", regex: /true/ },
  { name: "FALSE", regex: /false/ },

  //CONDICIONALES
  { name: "IF", regex: /if/ },
  { name: "ELSE", regex: /else/ },

  //LOOPS
  { name: "FOR", regex: /for/ },

  //FLUTAR DEBUG
  { name: "HIFLUTAR", regex: /hi_flutar/ },
  { name: "SETHOMEURL", regex: /set_home_url =>/ },

  { name: "NUMBER", regex: /-?\d+(\.\d+)?|\.\d+/ },
  { name: "STRING", regex: /"(.*?)"/ },
  { name: "CONCATENATE", regex: /\+/ },
  { name: "VAR", regex: /lex/ },
  { name: "PRINT", regex: /log/ },
  { name: "SENDTORENDER", regex: /send_to_render =>/ },
  { name: "REGISTERWINDOW", regex: /register_this =>/ },
  { name: "CONSOLETEST", regex: /see_console/ },
  { name: "RETURN", regex: /return/ },
  { name: "FUNCTION", regex: /fun\s*/ },
  { name: "RENDER", regex: /render\s*/ },
  { name: "HTML", regex: /<([a-zA-Z][^\s>]*)[^>]*>[\s\S]*?<\/\1>/ },
  { name: "EQUALS", regex: /=/ },
  { name: "IDENTIFIER", regex: /(?:[a-zA-Z][a-zA-Z0-9]*|fun)/ },
  { name: "OPERATOR", regex: /(&&|\|\||!|<=|>=|=|<|>)/ },
  { name: "LPAREN", regex: /\(/ },
  { name: "RPAREN", regex: /\)/ },
  { name: "LBRACE", regex: /{/ },
  { name: "RBRACE", regex: /}/ },
  { name: "DOUBLEEQUALS", regex: /::/ },
  { name: "DOUBLEPOINT", regex: /:/ },
  { name: "SEMICOLON", regex: /;/ },
  { name: "COMMA", regex: /,/ },
  { name: "PLUS", regex: /\+/ },
  { name: "MINUS", regex: /-/ },
  { name: "MULTIPLY", regex: /\*/ },
  { name: "DIVIDE", regex: /\// },
  { name: "POWER", regex: /`/ },
  { name: "PERCENTAGE", regex: /%/ },
];

module.exports = tokens;
