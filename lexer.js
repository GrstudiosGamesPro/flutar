const tokens = require('./tokens.js');

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

module.exports = lex;