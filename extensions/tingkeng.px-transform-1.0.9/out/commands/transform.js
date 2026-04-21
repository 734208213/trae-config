'use strict';

var getTransformConfiguration = require('../utils/getTransformConfiguration.js');
var runConversion = require('../utils/runConversion.js');
require('vscode');

const transform = () => {
    runConversion.runConversion(getTransformConfiguration.getTransformConfiguration(), "px-transform.multiply" /* COMMAND_KEYS.TRANSFORM */);
};

exports.transform = transform;
//# sourceMappingURL=transform.js.map
