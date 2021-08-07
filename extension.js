// https://medium.com/@aleksandrasays/developing-vs-code-extensions-b6debc865a55

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below

const vscode = require('vscode');
const format = require('./DateFormat.js');

function replaceEditorSelection() {
	var userConfig = vscode.workspace.getConfiguration("writeTimestamp");

    var fmt = null;
    
    var gmt         = userConfig.aGMT;
    var customFmt   = userConfig.bCustomFormat;
    var listSel     = userConfig.aList; // have to put list below, otherwise z-index is whack when opening list (other text bleeds into list)

    if(customFmt){
        fmt = customFmt;
    }
    if( ! fmt && listSel != 'custom'){
        fmt = listSel;
    }
    var text = format(fmt, gmt) + (gmt ? " GMT" : "");

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
