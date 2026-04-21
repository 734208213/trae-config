'use strict';

var getTransformConfiguration = require('../utils/getTransformConfiguration.js');
var runConversion = require('../utils/runConversion.js');
require('vscode');

const inverseTransform = () => {
    runConversion.runConversion(getTransformConfiguration.getTransformConfiguration(), "px-transform.divide" /* COMMAND_KEYS.INVERSE_TRANSFORM */);
};

exports.inverseTransform = inverseTransform;
//# sourceMappingURL=inverseTransform.js.map
