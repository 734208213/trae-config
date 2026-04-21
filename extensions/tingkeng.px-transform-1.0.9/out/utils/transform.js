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

const multipilicationTransform = (value, multiplier, unitPrecision) => {
    if (multiplier === 0) {
        return 0;
    }
    return parseFloat((value * multiplier).toFixed(unitPrecision));
};
const divisionTransform = (value, multiplier, unitPrecision) => {
    if (multiplier === 0) {
        return vscode__namespace.window.showErrorMessage("Inverse transform cannot be performed when the multiplier is 0" /* MESSAGES.INVERSE_TRANSFORM_FAIL */);
    }
    return parseFloat((value / multiplier).toFixed(unitPrecision));
};

exports.divisionTransform = divisionTransform;
exports.multipilicationTransform = multipilicationTransform;
//# sourceMappingURL=transform.js.map
