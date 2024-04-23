const app = require("./flutar_apps/flutar_html.js");
const components = require("./flutar_apps/component_module.js");

function execute(statements, environment = {}) {
  function evaluateExpression(expr) {
    if (!isNaN(expr)) {
      return expr;
    } else if (expr.startsWith('"') && expr.endsWith('"')) {
      return expr.slice(1, -1);
    } else if (expr.startsWith("<") && expr.endsWith(">")) {
      return expr;
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

    if (statement.type === "variableDeclaration") {
      environment[statement.identifier] = evaluateExpression(statement.value);
    } else if (statement.type === "sethomeURL") {
      const value = evaluateExpression(statement.value);
      app.set_url(value);
      console.log("DATA: " + value);
    } else if (statement.type === "functionCallVariable") {
      if (environment[statement.functionName]) {
        const func = environment[statement.functionName];
        const args = statement.args.map((arg) => evaluateExpression(arg));
        const functions = statement.functions.map((arg) =>
          evaluateExpression(arg)
        );

        func(...args);

        if (environment["_returnValue"] !== undefined) {
          environment[statement.identifier] = evaluateExpression(
            environment["_returnValue"]
          );
        }
      } else {
        throw new Error(`Function "${statement.functionName}" is not defined.`);
      }
    } else if (statement.type === "printStatement") {
      const value = evaluateExpression(statement.value);
      if (typeof value === "string") {
        console.log(value);
      } else {
        console.log("HTML:", environment["_returnValue"]);
      }
    } else if (statement.type === "registerPage") {
      const value = evaluateExpression(statement.name);
      if (typeof value === "string") {
        const func = environment[statement.functionName];
        const args = statement.args.map((arg) => evaluateExpression(arg));

        func(...args);

        if (environment["_returnValue"] !== undefined) {
          environment[statement.identifier] = evaluateExpression(
            environment["_returnValue"]
          );
        }

        app.register_page(value);

        components.verify_component(
          value,
          evaluateExpression(environment["_returnValue"])
        );
      } else {
        console.log("HTML:", environment["_returnValue"]);
      }
      // } else if (statement.type === "sendToRenderStatement") {
      //   if (environment[statement.functionName]) {
      //     const func = environment[statement.functionName];
      //     // const args = statement.args.map((arg) => evaluateExpression(arg));

      //     // func(...args);

      //     if (environment["_returnValue"] !== undefined) {
      //       components.verify_component(
      //         evaluateExpression(environment["_returnValue"])
      //       );

      //       console.log(environment["_returnValue"]);
      //     }
      //   } else {
      //     components.verify_component(
      //       evaluateExpression(environment["_returnValue"])
      //     );
      //     console.log(environment["_returnValue"]);
      //     //throw new Error(`Function "${statement.functionName}" is not defined.`);
      //   }
      // } else if (statement.type === "seeConsoleStatement") {
      console.log("Hello from console!");
    } else if (statement.type === "hiFlutar") {
      app.hi_flutar();
    } else if (statement.type === "renderStatement") {
      setInterval(() => {
        execute(statement.functionBody, environment);
      }, 1000);
    } else if (statement.type === "functionDeclaration") {
      environment[statement.functionName] = (...args) => {
        const newEnvironment = { ...environment };
        for (let i = 0; i < statement.parameters.length; i++) {
          newEnvironment[statement.parameters[i]] = args[i];
        }

        for (let data of statement.functionBody) {
          if (data.type === "returnStatement") {
            environment["_returnValue"] = evaluateExpression(data.value);
            environment["_returnType"] = data.type;
          }
        }

        execute(statement.functionBody, newEnvironment);
      };
    } else if (statement.type === "functionCall") {
      if (environment[statement.functionName]) {
        const func = environment[statement.functionName];
        const args = statement.args.map((arg) => evaluateExpression(arg));

        func(...args);
      } else {
        throw new Error(`Function "${statement.functionName}" is not defined.`);
      }
    } else if (statement.type === "ifState") {
      let stateIf = statement.operator;
      let val1 = evaluateExpression(statement.val1);
      let val2 = evaluateExpression(statement.val2);

      if (stateIf === ">") {
        if (val1 > val2) {
          execute(statement.functionBody, environment);
        }
      } else if (stateIf === "<") {
        if (val1 < val2) {
          execute(statement.functionBody, environment);
        }
      } else if (stateIf === ">=") {
        if (val1 >= val2) {
          execute(statement.functionBody, environment);
        }
      } else if (stateIf === "<=") {
        if (val1 <= val2) {
          execute(statement.functionBody, environment);
        }
      } else if (stateIf === "=") {
        if (val1 === val2) {
          execute(statement.functionBody, environment);
        }
      } else if (stateIf === "!=") {
        if (val1 !== val2) {
          execute(statement.functionBody, environment);
        }
      } else if (stateIf === "&&") {
        if (val1 && val2) {
          execute(statement.functionBody, environment);
        }
      } else if (stateIf === "||") {
        if (val1 || val2) {
          execute(statement.functionBody, environment);
        }
      } else if (stateIf === "!") {
        if (!val1) {
          execute(statement.functionBody, environment);
        }
      } else if (stateIf === "else") {
        if (statement.elseFunctionBody) {
          execute(statement.elseFunctionBody, environment);
        }
      }
    } else if (statement.type === "forLoop") {
      const initialization = evaluateExpression(statement.initialization);
      const condition = evaluateExpression(statement.condition);
      const increment = statement.increment;

      if (condition > 0) {
        for (let i = initialization; i < condition; ) {
          environment[statement.identifier] = evaluateExpression(i);
          i += increment;
          execute(statement.functionBody, environment);
          execute(i, environment);
        }
      } else {
        for (let i = initialization; i > condition; ) {
          environment[statement.identifier] = evaluateExpression(i);
          i += increment;
          execute(statement.functionBody, environment);
          execute(i, environment);
        }
      }
    }
  }
}

module.exports = execute;
