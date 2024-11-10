// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('linelength-import-sorter.sortImports', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		const editor = vscode.window.activeTextEditor
		const document = editor.document
		const language = document.languageId
		const lineCount = document.lineCount

		var lines = []
		for(var i=0;i<lineCount;i++){
			lines.push(document.lineAt(i).text)
		}
		
		if(language === "python"){
			var importsPositions = getPositions(lines)
			var dictLength = importsPositions['start-positions'].length
			var importSection, sortedImportSection
			for(let i = 0;i < dictLength; i++){
				importSection = lines.slice(importsPositions['start-positions'][i],importsPositions['end-positions'][i] + 1)
				sortedImportSection = importSection.sort((a,b)=>{
					return a.length - b.length
				})
				lines.splice(importsPositions['start-positions'][i],sortedImportSection.length, ...sortedImportSection)
			}

			editor.edit(editBuilder =>{
				editBuilder.replace(
					new vscode.Range(0,0,document.lineCount,0),
					lines.join("\n")
				)
			})
		}

	});

	context.subscriptions.push(disposable);
}

function getPositions(lines){
		var importsPositions = {}
		var linesLength = lines.length
		var prevImport = false

	importsPositions['start-positions'] = []
	importsPositions['end-positions'] = []

	for(let i = 0; i < linesLength; i++){
		if (isImport(lines[i])){
			if(!prevImport){
				
				importsPositions['start-positions'].push(i)
				prevImport = true    
			}
			else if (i == linesLength - 1){
				importsPositions['end-positions'].push(i)
			}
		}
		else{
			if(prevImport){
				prevImport = false
				importsPositions['end-positions'].push(i-1)	
			}
		}
	}
	return importsPositions
}

function isImport(importString){
	if (importString.startsWith("from ") || importString.startsWith("import ")){
		return true
	}
	
	else if(importString.trimStart().startsWith("from ") || importString.trimStart().startsWith("import ")){
		return true
	}
	return false
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
