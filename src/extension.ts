//@ts-nocheck

import * as vscode from 'vscode';
import axios from 'axios';
import * as xmlParser from 'fast-xml-parser';

import {SidebarProvider} from './SidebarProvider/SidebarProvider';

type ArticlesType = {
	label: string,
	detail: string,
	link: string
};

type ArticleItem = ArticlesType[];

 export async function activate(context: vscode.ExtensionContext) {
// 	TokenManager.globalState = context.globalState;
// const sidebarProvider = new SidebarProvider(context.extensionUri);
// const item = vscode.window.createStatusBarItem(
// 	vscode.StatusBarAlignment.Right
// );

// item.text = "here you can find your article";
// item.command = "lesson-site.search-lesson";
// item.show();

// context.subscriptions.push(
// 	vscode.window.registerWebviewViewProvider("lesson-sidebar", sidebarProvider)
// );

	const result = await axios.get("https://blog.webdevsimplified.com/rss.xml");
    const articles = xmlParser
.parse(result.data)
.rss.channel.item.map((article: ArticleItem[] | any) => {
	return {
		label: article.title,
		detail: article.description,
        link: article.link,
	};
});

console.log(articles);


	console.log('Congratulations, your extension "lesson-site" is now active!');

	let disposable = vscode.commands.registerCommand('lesson-site.search-lesson', 
	async function ()  {
   const article: any= await vscode.window.showQuickPick(articles, {
	matchOnDetail: true,
});
if(!article) {
	return;
};


vscode.env.openExternal(article.link);
		vscode.window.showInformationMessage('Hello World from lesson-site!');
	});

	context.subscriptions.push(disposable);

	context.subscriptions.push(
		vscode.commands.registerCommand("lesson-site.question", async () => {
		  const answer = await vscode.window.showInformationMessage(
			"How was your day?",
			"good",
			"bad"
		  );
	
		  if (answer === "bad") {
			vscode.window.showInformationMessage("Sorry to hear that");
		  } else {
			console.log({ answer });
		  }
		})
	  );
}

export function deactivate() {}
