'use strict';

exports.COMMAND_KEYS = void 0;
(function (COMMAND_KEYS) {
    COMMAND_KEYS["TRANSFORM"] = "px-transform.multiply";
    COMMAND_KEYS["INVERSE_TRANSFORM"] = "px-transform.divide";
})(exports.COMMAND_KEYS || (exports.COMMAND_KEYS = {}));
const CONFIGURATION_PREFIX = 'transform';
const NUM_REGEXP = '([0-9]*\\.?[0-9]+)';
exports.MESSAGES = void 0;
(function (MESSAGES) {
    MESSAGES["NO_VALUE_TRANSFORMED"] = "There were no values to transform";
    MESSAGES["TRANSFORM_SUCCESS"] = "Transform Success";
    MESSAGES["INVERSE_TRANSFORM_FAIL"] = "Inverse transform cannot be performed when the multiplier is 0";
})(exports.MESSAGES || (exports.MESSAGES = {}));

exports.CONFIGURATION_PREFIX = CONFIGURATION_PREFIX;
exports.NUM_REGEXP = NUM_REGEXP;
//# sourceMappingURL=constant.js.map
