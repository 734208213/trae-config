'use strict';

var vscode = require('vscode');
var getConvertedResult = require('./getConvertedResult.js');
var findValueRangeToConvert = require('./findValueRangeToConvert.js');

function runConversion(config, commandType) {
    const { activeTextEditor: textEditor, showErrorMessage } = vscode.window;
    if (!textEditor || textEditor.selections.length === 0) {
        return showErrorMessage('No selection');
    }
    textEditor.edit((builder) => {
        const { showInformationMessage, showWarningMessage } = vscode.window;
        let totalConversion = 0;
        // Iterate over each cursor selected
        textEditor.selections.forEach((selection) => {
            for (let i = selection.start.line; i <= selection.end.line; i++) {
                // https://code.visualstudio.com/api/references/vscode-api#Position
                // column index of start character
                // case middle selection (besides first and end line)
                const col = {
                    start: 0,
                    end: textEditor.document.lineAt(i).range.end.character,
                };
                const convertConfig = getConvertedResult.getConvertedResultConfig(config, commandType);
                // case first line or only one line
                if (i === selection.start.line) {
                    // const tmpSelection = selection.with({ end: selection.start });
                    const range = findValueRangeToConvert.findValueRangeToConvert(i, selection.start.character, convertConfig.regexExpG, textEditor);
                    col.start = range ? range.start.character : selection.start.character;
                }
                // why not else if: consider the situation select only one line.
                // case end line or only one line
                if (i === selection.end.line) {
                    // const tmpSelection = selection.with({ start: selection.end });
                    const range = findValueRangeToConvert.findValueRangeToConvert(i, selection.end.character, convertConfig.regexExpG, textEditor);
                    col.end = range ? range.end.character : selection.end.character;
                }
                const originalText = textEditor.document
                    .lineAt(i)
                    .text.slice(col.start, col.end);
                showErrorMessage(`${col.start}`);
                const { convertedText, matcheCounts } = getConvertedResult.getConvertedResult(originalText, convertConfig);
                // showErrorMessage(convertedText);
                if (matcheCounts === 0)
                    continue;
                const selectionTmp = new vscode.Selection(i, col.start, i, col.end);
                builder.replace(selectionTmp, convertedText);
                totalConversion += matcheCounts;
            }
        });
        if (totalConversion === 0) {
            showWarningMessage("There were no values to transform" /* MESSAGES.NO_VALUE_TRANSFORMED */);
        }
        else {
            showInformationMessage("Transform Success" /* MESSAGES.TRANSFORM_SUCCESS */);
        }
    });
}
/**
 * selection 选中的每一行的数据
 * selection.start.line 开始行数
 * selection.start.end 结束行数
 * start 一行内的开始字符串index
 * end 一行内的截止字符串index
 *
 * 实现思路
 * 1.找到要被转换的范围, 如'100px'. new Range(selection.start, selection.end);
 * 2. 进行运算 const newText = text.replace(regexExpG, replaceFunction);
 * 3. 进行替换 editBuilder.replace(item.range, item.converted);
 *   3.1其中item.range是new Range对象; item.converted 是最终展示的字符串;
 *
 * i=== 0 第一行 selection.start.character 表示其实位置
 * 多行选中时, 其余行, 肯定都是从0开始, start = 0
 * i===end 最后一行 end = end.character
 *
 * @param builder
 * @param selections
 * @param textEditor
 * @param regPattern
 * @param replaceFunction
 */

exports.runConversion = runConversion;
//# sourceMappingURL=runConversion.js.map
