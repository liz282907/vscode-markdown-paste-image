'use strict';
import * as vscode from 'vscode';
import {latexSymbols} from './latex';
import {Paster} from './paster';

class LatexSymbol {
    latexItems: vscode.QuickPickItem[] = [];

    public getItems() {
        return this.latexItems;
    }

    public load(latexSymbols) {
        this.latexItems = [];
        for (let name in latexSymbols) {
            this.latexItems.push({
                description: latexSymbols[name],
                label: name,
            });
        }
    }

    public insertToEditor(item: vscode.QuickPickItem) {
        if (!item) { return; }
        let editor = vscode.window.activeTextEditor;
        if (!editor) { return; }
    
        editor.edit( (editBuilder) => {
            editBuilder.delete(editor.selection);
        }).then( () => {
            editor.edit( (editBuilder) => {
                editBuilder.insert(editor.selection.start, item.description);
            });
        });
    }
}


export function activate(context: vscode.ExtensionContext) {
    console.log('"vscode-markdown-paste" is now active!');
    let LatexMathSymbol = new LatexSymbol();
    LatexMathSymbol.load(latexSymbols);
    vscode.commands.registerCommand('telesoho.insertMathSymbol', () => {
        vscode.window.showQuickPick(LatexMathSymbol.getItems(), {
            ignoreFocusOut: true,
        }).then(LatexMathSymbol.insertToEditor);
    });

    context.subscriptions.push(vscode.commands.registerCommand(
        'telesoho.MarkdownPaste', () => {
            console.log('Paster.pasteText');
            Paster.pasteText();
        }));
    context.subscriptions.push(vscode.commands.registerCommand(
        'telesoho.MarkdownRuby', () => {
            Paster.Ruby();
        }));
}

export function deactivate() {
    console.log('"vscode-markdown-paste" is now deactivate!');
}

