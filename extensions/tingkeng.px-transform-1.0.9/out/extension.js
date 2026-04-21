'use strict';

var vscode = require('vscode');
var inverseTransform = require('./commands/inverseTransform.js');
var transform = require('./commands/transform.js');

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

function activate(context) {
    context.subscriptions.push(vscode__namespace.commands.registerTextEditorCommand("px-transform.multiply" /* COMMAND_KEYS.TRANSFORM */, transform.transform), vscode__namespace.commands.registerTextEditorCommand("px-transform.divide" /* COMMAND_KEYS.INVERSE_TRANSFORM */, inverseTransform.inverseTransform));
}
function deactivate() { }

exports.activate = activate;
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map
