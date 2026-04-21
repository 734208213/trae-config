'use strict';

var vscode = require('vscode');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var vscode__namespace = /*#__PURE__*/_interopNamespaceDefault(vscode);

/**
 * If cursor locates at the inner of a regex matched value,the method can find the Range of the value.
 * 处理光标处于数值中间的情况
 * @param selection
 * @param regex
 * @param textEditor
 * @returns
 */
function findValueRangeToConvert(line, startChar, regex, textEditor) {
    const { text } = textEditor.document.lineAt(line);
    const regexExpG = new RegExp(regex, 'ig');
    let result;
    while ((result = regexExpG.exec(text))) {
        const resultStart = result.index;
        const resultEnd = result.index + result[0].length;
        if (startChar >= resultStart && startChar <= resultEnd) {
            return new vscode__namespace.Range(line, resultStart, line, resultEnd);
        }
    }
    return null;
}

exports.findValueRangeToConvert = findValueRangeToConvert;
//# sourceMappingURL=findValueRangeToConvert.js.map
