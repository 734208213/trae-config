"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const child_process = require("child_process");
let commands = ["update", "commit", "log", "diff", "rename", "delete", "revert", "blame"];
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "svn-helper" is now active!');
    for (let command of commands) {
        context.subscriptions.push(vscode.commands.registerCommand("zlorn.svn." + command, (uri) => {
            let path = getPath(uri);
            console.log("tortoise svn " + command + " -> " + path);
            doCommand(command, path);
        }));
    }
}
exports.activate = activate;
function getPath(uri) {
    if (uri && uri.fsPath) {
        return uri.fsPath;
    }
    else if (vscode.window.activeTextEditor && vscode.window.activeTextEditor.document) {
        return vscode.window.activeTextEditor.document.fileName;
    }
    else {
        return vscode.workspace.rootPath;
    }
}
function doCommand(cmd, path) {
    child_process.exec(`TortoiseProc.exe /command:${cmd} /path:${path}`, (error, stdout, stderr) => {
        if (error) {
            console.log(`tortoise svn error -> ${error}`);
        }
        if (stdout) {
            console.log(`tortoise svn stdout -> ${stdout}`);
        }
        if (stderr) {
            console.log(`tortoise svn stderr -> ${stderr}`);
        }
    });
}
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map