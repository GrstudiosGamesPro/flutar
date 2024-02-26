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
        if (tokens[current].type === 'STRING' || tokens[current].type === 'NUMBER') {
            const value = tokens[current].value;
            current++;
            return value; // Aquí devolvemos directamente el valor
        } else if (tokens[current].type === 'IDENTIFIER') {
            const identifier = tokens[current].value;
            current++;
            return identifier; // Aquí devolvemos directamente el identificador
        } else {
            throw new Error(`Unexpected token in expression: ${tokens[current].type}`);
        }
    }

    function statement() {
        if (tokens[current].type === 'VAR') {
            consume('VAR');
            const identifier = tokens[current].value;
            consume('IDENTIFIER');
            consume('EQUALS');
            const value = expression();
            console.log("Valor del identificador: " + value);
            consume('SEMICOLON');
            return { type: 'variableDeclaration', identifier, value };
        } else if (tokens[current].type === 'PRINT') {
            consume('PRINT');
            consume('LPAREN');
            const value = expression();
            consume('RPAREN');
            consume('SEMICOLON');
            return { type: 'printStatement', value };
        } else if (tokens[current].type === 'CONSOLETEST') {
            consume('CONSOLETEST');
            consume('LPAREN');
            consume('RPAREN');
            consume('SEMICOLON');
            return { type: 'seeConsoleStatement' };
        } else if (tokens[current].type === 'RETURN') {
            consume('RETURN');
            const value = expression();
            consume('SEMICOLON');
            return { type: 'returnStatement', value };
        }
        else if (tokens[current].type === 'FUNCTION') {
            consume('FUNCTION');
            const functionName = tokens[current].value;
            consume('IDENTIFIER');
            consume('LPAREN');
            const parameters = [];
            while (tokens[current].type !== 'RPAREN') {
                parameters.push(tokens[current].value);
                consume('IDENTIFIER');
                if (tokens[current].type === 'COMMA') {
                    consume('COMMA');
                }
            }
            consume('RPAREN');
            consume('LBRACE');
            const functionBody = [];
            while (tokens[current].type !== 'RBRACE') {
                functionBody.push(statement());
            }
            consume('RBRACE');

            let hasReturn = false;

            for (const statement of functionBody) {
                if (statement.type === 'returnStatement') {
                    console.log("RETURN FOUND IN THIS FUNCTION => " + statement.value);
                    functionBody.push({ type: 'returnStatement', value: statement.value });
                    hasReturn = true;
                    break;
                }
            }


            // if (!hasReturn) {
            //     functionBody.push({ type: 'returnStatement', value: undefined });
            // }

            return { type: 'functionDeclaration', functionName, parameters, functionBody };
        }
        else if (tokens[current].type === 'IDENTIFIER') {
            const identifier = tokens[current].value;
            consume('IDENTIFIER');
            if (tokens[current].type === 'LPAREN') {
                consume('LPAREN');
                const args = [];
                while (tokens[current].type !== 'RPAREN') {
                    args.push(expression());
                    if (tokens[current].type === 'COMMA') {
                        consume('COMMA');
                    }
                }
                consume('RPAREN');
                consume('SEMICOLON');
                return { type: 'functionCall', functionName: identifier, args };
            } else {
                throw new Error(`Unexpected token after identifier: ${tokens[current].type}`);
            }
        } else {
            throw new Error(`Unexpected token in statement: ${tokens[current].type}`);
        }
    }

    const statements = [];
    while (current < tokens.length) {
        console.log("Current token:", tokens[current]);
        statements.push(statement());
    }

    return statements;
}

module.exports = parse;
