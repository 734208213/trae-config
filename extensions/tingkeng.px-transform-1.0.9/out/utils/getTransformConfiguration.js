'use strict';

var vscode = require('vscode');
var constant = require('../constant.js');

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

const getTransformConfiguration = () => {
    const config = vscode__namespace.workspace.getConfiguration(constant.CONFIGURATION_PREFIX);
    return {
        multiplier: config.get('multiplier'),
        targetUnit: config.get('targetUnit'),
        sourceUnit: config.get('sourceUnit'),
        unitPrecision: config.get('unitPrecision'),
    };
};

exports.getTransformConfiguration = getTransformConfiguration;
//# sourceMappingURL=getTransformConfiguration.js.map
