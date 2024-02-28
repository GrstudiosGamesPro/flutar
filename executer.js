const { json } = require("stream/consumers");

function execute(statements, environment = {}) {

    function evaluateExpression(expr) {
        if (!isNaN(expr)) {
            return expr;
        } else if (expr.startsWith('"') && expr.endsWith('"')) {
            return expr.slice(1, -1);
        } else {
            return environment[expr];
        }
    }

    for (const variable in environment) {
        if (environment.hasOwnProperty(variable)) {
            environment[variable] = environment[variable];
        }
    }

    for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];

        if (statement.type === 'variableDeclaration') {
            environment[statement.identifier] = evaluateExpression(statement.value);
        } else if (statement.type === 'functionCallVariable') {
            if (environment[statement.functionName]) {
                const func = environment[statement.functionName];
                const args = statement.args.map(arg => evaluateExpression(arg));

                func(...args);

                if (environment['_returnValue'] !== undefined) {
                    environment[statement.identifier] = evaluateExpression(environment['_returnValue']);
                }
            } else {
                throw new Error(`Function "${statement.functionName}" is not defined.`);
            }
        }
        else if (statement.type === 'printStatement') {
            console.log(evaluateExpression(statement.value));
        } else if (statement.type === 'seeConsoleStatement') {
            console.log("Hello from console!");
        } else if (statement.type === 'functionDeclaration') {
            environment[statement.functionName] = (...args) => {
                const newEnvironment = { ...environment };
                for (let i = 0; i < statement.parameters.length; i++) {
                    newEnvironment[statement.parameters[i]] = args[i];
                }

                for (let data of statement.functionBody) {
                    if (data.type === 'returnStatement') {
                        environment['_returnValue'] = data.value;
                    }
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

module.exports = execute;