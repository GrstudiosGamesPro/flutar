// Lexer
const tokens = [
    { name: 'NUMBER', regex: /\d+/ },
    { name: 'STRING', regex: /"(.*?)"/ },
    { name: 'VAR', regex: /var/ },
    { name: 'PRINT', regex: /print/ },
    { name: 'FUNCTION', regex: /function/ },
    { name: 'IDENTIFIER', regex: /[a-zA-Z][a-zA-Z0-9]*/ },
    { name: 'LPAREN', regex: /\(/ },
    { name: 'RPAREN', regex: /\)/ },
    { name: 'LBRACE', regex: /{/ },
    { name: 'RBRACE', regex: /}/ },
    { name: 'EQUALS', regex: /=/ },
    { name: 'SEMICOLON', regex: /;/ },
    { name: 'RETURN', regex: /return/ },
    { name: 'COMMA', regex: /,/ },
    { name: 'PLUS', regex: /\+/ }, // Token para representar la suma
    { name: 'PARAM', regex: /param/ }, // Token para representar los parámetros de la función
    { name: 'WHITESPACE', regex: /\s+/, ignore: true }
];


function lex(code) {
    const tokensFound = [];
    let remainingCode = code.trim();

    while (remainingCode.length > 0) {
        let tokenMatched = false;

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            const regex = new RegExp('^' + token.regex.source);
            const match = regex.exec(remainingCode);

            if (match !== null) {
                tokenMatched = true;
                if (!token.ignore) {
                    tokensFound.push({
                        type: token.name,
                        value: match[0]
                    });
                }
                remainingCode = remainingCode.slice(match[0].length).trim();
                break;
            }
        }

        if (!tokenMatched) {
            throw new Error(`Unrecognized token at: ${remainingCode}`);
        }
    }

    return tokensFound;
}

// Parser
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
            return value;
        } else if (tokens[current].type === 'IDENTIFIER') {
            const identifier = tokens[current].value;
            current++;
            return identifier;
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
            consume('SEMICOLON');
            return { type: 'variableDeclaration', identifier, value };
        } else if (tokens[current].type === 'PRINT') {
            consume('PRINT');
            consume('LPAREN');
            const value = expression();
            consume('RPAREN');
            consume('SEMICOLON');
            return { type: 'printStatement', value };
        } else if (tokens[current].type === 'FUNCTION') {
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
        } else if (tokens[current].type === 'IDENTIFIER') {
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
        statements.push(statement());
    }

    return statements;
}

// Ejecución del código
// Ejecución del código
function execute(statements, environment = {}) {
    function evaluateExpression(expr) {
        if (!isNaN(expr)) {
            return parseInt(expr);
        } else if (expr.startsWith('"') && expr.endsWith('"')) {
            return expr.slice(1, -1);
        } else {
            return environment[expr];
        }
    }

    // Agregar las variables externas al entorno de la función
    for (const variable in environment) {
        if (environment.hasOwnProperty(variable)) {
            environment[variable] = environment[variable];
        }
    }

    for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        if (statement.type === 'variableDeclaration') {
            environment[statement.identifier] = evaluateExpression(statement.value);
        } else if (statement.type === 'printStatement') {
            console.log(evaluateExpression(statement.value));
        } else if (statement.type === 'functionDeclaration') {
            environment[statement.functionName] = (...args) => {
                const newEnvironment = { ...environment }; // Copia del entorno actual
                for (let i = 0; i < statement.parameters.length; i++) {
                    newEnvironment[statement.parameters[i]] = args[i];
                }
                execute(statement.functionBody, newEnvironment);
            };
        } else if (statement.type === 'functionCall') {
            if (environment[statement.functionName]) {
                const func = environment[statement.functionName];
                const args = statement.args.map(arg => evaluateExpression(arg));
                func(...args);
            } else {
                throw new Error(`Function "${statement.functionName}" is not defined.`);
            }
        }
    }
}


// Ejemplo de uso
const code = `
    var x = 10;
    var z = "hello brother";
    var y = "hello";
    print(x);
    print(y);

    function a(param1, param2) {
        print(z);
        print(param1);
        print(param2);
    }

    a(5, "world");
`;

const tokensFound = lex(code);
const parsedStatements = parse(tokensFound);
execute(parsedStatements);