function parse(tokens) {
  let current = 0;

  function consume(type) {
    if (tokens[current].type === type) {
      current++;
    } else {
      throw new Error(`Unexpected token: ${tokens[current].type}`);
    }
  }

  function expression() {
    if (tokens[current].type === "STRING") {
      const value = tokens[current].value;
      current++;
      return value;
    } else if (tokens[current].type === "NUMBER") {
      const value = tokens[current].value;
      current++;
      return parseFloat(value);
    } else if (tokens[current].type === "IDENTIFIER") {
      const identifier = tokens[current].value;
      current++;
      return identifier;
    } else if (tokens[current].type === "HTML") {
      const htmlStartIndex = current;
      let html = "";

      while (tokens[current].type === "HTML") {
        html += tokens[current].value;
        current++;
      }

      return html;
    } else if (tokens[current].type === "LPAREN") {
      consume("LPAREN");
      const result = evaluate();
      consume("RPAREN");
      return result;
    } else {
      throw new Error(
        `Unexpected token in expression: ${tokens[current].type}`
      );
    }
  }

  function evaluate() {
    let left = expression();

    while (
      tokens[current] &&
      (tokens[current].type === "PLUS" ||
        tokens[current].type === "MINUS" ||
        tokens[current].type === "MULTIPLY" ||
        tokens[current].type === "DIVIDE" ||
        tokens[current].type === "POWER" ||
        tokens[current].type === "PERCENTAGE" ||
        tokens[current].type === "EXPONENTIAL")
    ) {
      const operator = tokens[current].type;
      current++;
      const right = expression();

      if (operator === "PLUS") {
        left = parseFloat(left) + parseFloat(right);
      } else if (operator === "MINUS") {
        left = parseFloat(left) - parseFloat(right);
      } else if (operator === "MULTIPLY") {
        left = parseFloat(left) * parseFloat(right);
      } else if (operator === "DIVIDE") {
        if (parseFloat(right) === 0) {
          throw new Error("Division by zero");
        }
        left = parseFloat(left) / parseFloat(right);
      } else if (operator === "POWER") {
        left = Math.pow(parseFloat(left), parseFloat(right));
      } else if (operator === "PERCENTAGE") {
        left = (parseFloat(left) * parseFloat(right)) / 100;
      }
    }

    return left;
  }

  function statement() {
    if (tokens[current].type === "VAR") {
      consume("VAR");
      const identifier = tokens[current].value;
      consume("IDENTIFIER");

      consume("EQUALS");
      let value = expression();

      // Verifica si el valor es una llamada de función
      if (tokens[current].type === "LPAREN") {
        consume("LPAREN");
        const args = [];
        while (tokens[current].type !== "RPAREN") {
          const result = expression();
          args.push(result);

          if (tokens[current].type === "COMMA") {
            consume("COMMA");
          }
        }

        consume("RPAREN");
        consume("SEMICOLON");

        // Devuelve una estructura que representa una llamada de función
        return {
          type: "functionCallVariable",
          functionName: value,
          args,
          identifier,
        };
      } else {
        // Si no es una llamada de función, es una simple asignación de variable
        consume("SEMICOLON");
        return { type: "variableDeclaration", identifier, value };
      }
    } else if (tokens[current].type === "PRINT") {
      consume("PRINT");
      consume("LPAREN");
      const value = expression();
      consume("RPAREN");
      consume("SEMICOLON");
      return { type: "printStatement", value };
    } else if (tokens[current].type === "SENDTORENDER") {
      consume("SENDTORENDER");
      consume("LPAREN");
      const value = expression();
      consume("RPAREN");
      consume("SEMICOLON");
      return { type: "sendToRenderStatement", value };
    } else if (tokens[current].type === "CONSOLETEST") {
      consume("CONSOLETEST");
      consume("LPAREN");
      consume("RPAREN");
      consume("SEMICOLON");
      return { type: "seeConsoleStatement" };
    } else if (tokens[current].type === "HIFLUTAR") {
      consume("HIFLUTAR");
      consume("LPAREN");
      consume("RPAREN");
      consume("SEMICOLON");
      return { type: "hiFlutar" };
    } else if (tokens[current].type === "RETURN") {
      consume("RETURN");
      const value = expression();

      if (tokens[current].type === "LPAREN") {
        consume("LPAREN");
        const args = [];
        while (tokens[current].type !== "RPAREN") {
          const result = expression();
          args.push(result);

          if (tokens[current].type === "COMMA") {
            consume("COMMA");
          }
        }

        consume("RPAREN");
        consume("SEMICOLON");

        // Devuelve una estructura que representa una llamada de función
        return { type: "functionCallVariable", functionName: value, args };
      }

      consume("SEMICOLON");

      return { type: "returnStatement", value };
    } else if (tokens[current].type === "FOR") {
      consume("FOR");
      consume("LPAREN");
      consume("VAR");
      const identifier = tokens[current].value;
      consume("IDENTIFIER");
      consume("EQUALS");
      let initialization = expression();
      consume("COMMA");
      let condition = expression();
      consume("COMMA");
      let increment = expression();
      consume("RPAREN");
      consume("LBRACE");
      const functionBody = [];
      while (tokens[current].type !== "RBRACE") {
        functionBody.push(statement());
      }
      let body = 1;
      consume("RBRACE");

      return {
        type: "forLoop",
        identifier,
        initialization,
        condition,
        increment,
        body,
        functionBody,
      };
    } else if (tokens[current].type === "IF") {
      consume("IF");
      consume("LPAREN");
      let val1 = expression();

      const operator = tokens[current].value;
      consume("OPERATOR");

      let val2 = expression();

      consume("RPAREN");
      consume("LBRACE");
      const functionBody = [];
      while (tokens[current].type !== "RBRACE") {
        functionBody.push(statement());
      }
      consume("RBRACE");
      return { type: "ifState", val1, val2, operator, functionBody };
    } else if (tokens[current].type === "FUNCTION") {
      consume("FUNCTION");
      const functionName = tokens[current].value;
      consume("IDENTIFIER");
      consume("LPAREN");
      const parameters = [];
      while (tokens[current].type !== "RPAREN") {
        parameters.push(tokens[current].value);
        consume("IDENTIFIER");
        if (tokens[current].type === "COMMA") {
          consume("COMMA");
        }
      }
      consume("RPAREN");
      consume("LBRACE");

      const functionBody = [];
      while (tokens[current].type !== "RBRACE") {
        functionBody.push(statement());
      }

      consume("RBRACE");

      return {
        type: "functionDeclaration",
        functionName,
        parameters,
        functionBody,
      };
    } else if (tokens[current].type === "IDENTIFIER") {
      const identifier = expression();
      if (tokens[current].type === "LPAREN") {
        consume("LPAREN");
        const args = [];
        while (tokens[current].type !== "RPAREN") {
          args.push(expression());

          if (tokens[current].type === "COMMA") {
            consume("COMMA");
          }
        }
        consume("RPAREN");
        consume("SEMICOLON");

        return { type: "functionCall", functionName: identifier, args };
      } else if (tokens[current].type === "EQUALS") {
        consume("EQUALS");
        const value = expression();
        consume("SEMICOLON");

        return { type: "variableAssignment", variableName: identifier, value };
      } else {
        throw new Error(
          `Unexpected token after identifier: ${tokens[current].type}`
        );
      }
    } else {
      throw new Error(`Unexpected token in statement: ${tokens[current].type}`);
    }
  }

  const statements = [];
  while (current < tokens.length) {
    statements.push(statement());
  }

  return statements;
}

module.exports = parse;
