// https://medium.com/@aleksandrasays/developing-vs-code-extensions-b6debc865a55

const vscode = require('vscode');
const format = require('./DateFormat.js');

// register immediately, so always available
vscode.commands.registerCommand('writeTimestamp.perform', () => {
	let userConfig = vscode.workspace.getConfiguration("writeTimestamp");

    let fmt = null;
    
    let gmt         = userConfig.aGMT;
    let customFmt   = userConfig.bCustomFormat;
    let listSel     = userConfig.cList; // have to put list below, otherwise z-index is whack when opening list (other text bleeds into list)

    if(customFmt){
        fmt = customFmt;
    }

    if( ! fmt && listSel != 'custom'){
        fmt = listSel;
    }
    
    let text = format(fmt, gmt) + (gmt ? " GMT" : "");

    let editor = vscode.window.activeTextEditor;
    let selections = editor.selections;
    editor.edit( editBuilder => {
        selections.forEach(function (selection) {
            editBuilder.replace(selection, '');
            editBuilder.insert(selection.active, text);
        });
    });

});

function activate() {}
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
