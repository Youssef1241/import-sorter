// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "import-sorter" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('import-sorter.sortImports', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		// vscode.window.showInformationMessage('Get Ready to have your imports sorted!');
		const editor = vscode.window.activeTextEditor
		const document = editor.document
		const language = document.languageId
		const text = document.getText()
		const lines = text.split("\n")
		
		if (language === "python"){
			var lastImport = 0
			console.log("language is python")
			for(var i = 0; i<lines.length;i++){
				if (lines[i].slice(0,4) === "from" || lines[i].slice(0,6) === "import"){
					lastImport++
				}
				else{
					break
				}
			}
			var to_be_sorted = lines.slice(0,lastImport)
			var sorted_lines = to_be_sorted.sort((a,b)=>{
				return a.length - b.length
			})
			var remaining_lines = lines.slice(lastImport,lines.length)
			var final_lines = sorted_lines.concat(remaining_lines)
			editor.edit(editBuilder =>{
				editBuilder.replace(
					new vscode.Range(0,0,document.lineCount,0),
					final_lines.join("\n")
				)
			})
		}


	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
