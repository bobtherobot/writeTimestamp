// https://medium.com/@aleksandrasays/developing-vs-code-extensions-b6debc865a55

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below

const vscode = require('vscode');
const format = require('./DateFormat.js');

function replaceEditorSelection() {
	var userConfig = vscode.workspace.getConfiguration("writeTimestampString");
    console.log("userConfig", userConfig);
    var gmt = userConfig.gmt;
    var text = format(userConfig.format || "default", gmt) + (gmt ? " GMT" : "");

    var editor = vscode.window.activeTextEditor;
    var selections = editor.selections;
    editor.edit(function (editBuilder) {
        selections.forEach(function (selection) {
            editBuilder.replace(selection, '');
            editBuilder.insert(selection.active, text);
        });
    });

	vscode.window.showInformationMessage('Hello World from Write Timestamp!');
}

// register immediately, so always available
vscode.commands.registerCommand('writeTimestamp.perform', replaceEditorSelection);

function activate() {}
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
