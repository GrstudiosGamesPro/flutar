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
        if (tokens[current].type === 'STRING') {
            const value = tokens[current].value;
            current++;
            return value;
        } else if (tokens[current].type === 'IDENTIFIER') {
            const identifier = tokens[current].value;
            current++;
            return identifier;
        } else if (tokens[current].type === 'NUMBER') {
            const value = tokens[current].value;
            current++;
            return parseFloat(value);
        } else if (tokens[current].type === 'LPAREN') {
            consume('LPAREN');
            const result = evaluate();
            consume('RPAREN');
            return result;
        } else {
            throw new Error(`Unexpected token in expression: ${tokens[current].type}`);
        }
    }


    function evaluate() {
        let left_value = expression();
        console.log("LEFT EXPRESSION: " + left_value);
        current++;
        let right_value = expression();
        console.log("RIGHT EXPRESSION: " + right_value);
        current++;
    }

    // function expression() {
    //     if (tokens[current].type === 'STRING') {
    //         const value = tokens[current].value;
    //         current++;
    //         return value;
    //     } else if (tokens[current].type === 'NUMBER') {
    //         const value = tokens[current].value;
    //         current++;
    //         return value;
    //     } else if (tokens[current].type === 'IDENTIFIER') {
    //         const identifier = tokens[current].value;
    //         current++;
    //         return identifier;
    //     } else {
    //         throw new Error(`Unexpected token in expression: ${tokens[current].type}`);
    //     }
    // }

    function statement() {
        if (tokens[current].type === 'VAR') {
            consume('VAR');
            const identifier = tokens[current].value;
            consume('IDENTIFIER');
            consume('EQUALS');
            let value = expression();

            if (tokens[current].type !== 'LPAREN') {
                consume('SEMICOLON');
                return { type: 'variableDeclaration', identifier, value };
            } else if (tokens[current].type === 'LPAREN') {
                consume('LPAREN');
                const args = [];
                while (tokens[current].type !== 'RPAREN') {
                    const result = expression();
                    args.push(result);

                    if (tokens[current].type === 'COMMA') {
                        consume('COMMA');
                    }
                }


                consume('RPAREN');
                consume('SEMICOLON');
                return { type: 'functionCallVariable', functionName: value, args, identifier };
            }
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

            return { type: 'functionDeclaration', functionName, parameters, functionBody };
        }
        else if (tokens[current].type === 'IDENTIFIER') {
            const identifier = expression();
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
            } else if (tokens[current].type === 'EQUALS') {
                consume('EQUALS');
                const value = expression();
                consume('SEMICOLON');

                return { type: 'variableAssignment', variableName: identifier, value };
            } else {
                throw new Error(`Unexpected token after identifier: ${tokens[current].type}`);
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