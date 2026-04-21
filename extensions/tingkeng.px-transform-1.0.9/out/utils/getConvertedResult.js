'use strict';

var constant = require('../constant.js');
var transform = require('./transform.js');

const getConvertedResult = (text, { convertFunction, regexExpG, targetUnit, multiplier, unitPrecision, }) => {
    const matches = text.match(regexExpG) || [];
    if (!matches.length) {
        return {
            convertedText: text,
            matcheCounts: 0,
        };
    }
    const convertedText = text.replace(regexExpG, (_, value) => {
        return `${convertFunction(value, multiplier, unitPrecision)}${targetUnit}`;
    });
    return {
        convertedText,
        matcheCounts: matches.length,
    };
};
const getConvertedResultConfig = (vscodeTransformConfig, commandType) => {
    const { multiplier, targetUnit, sourceUnit, unitPrecision } = vscodeTransformConfig;
    const config = {
        convertFunction: null,
        sourceUnit: null,
        targetUnit: null,
        regexExpG: null,
        multiplier,
        unitPrecision,
    };
    switch (commandType) {
        case "px-transform.multiply" /* COMMAND_KEYS.TRANSFORM */:
            config.convertFunction = transform.multipilicationTransform;
            config.sourceUnit = sourceUnit;
            config.targetUnit = targetUnit;
            break;
        case "px-transform.divide" /* COMMAND_KEYS.INVERSE_TRANSFORM */:
            config.convertFunction = transform.divisionTransform;
            config.sourceUnit = targetUnit;
            config.targetUnit = sourceUnit;
            break;
        default:
            throw new Error('commandType error');
    }
    config.regexExpG = new RegExp(`${constant.NUM_REGEXP}${config.sourceUnit}`, 'ig');
    return config;
};

exports.getConvertedResult = getConvertedResult;
exports.getConvertedResultConfig = getConvertedResultConfig;
//# sourceMappingURL=getConvertedResult.js.map
