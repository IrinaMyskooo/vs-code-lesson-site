
import * as vscode from 'vscode';
import axios from 'axios';
import * as xmlParser from 'fast-xml-parser';


interface ArticlesQuickPickItem extends vscode.QuickPickItem  {
	link: string
};

interface ArticleType {
	title:  string,
	description: string,
	link: string
};

 export async function activate(context: vscode.ExtensionContext) {
	const result = await axios.get("https://blog.webdevsimplified.com/rss.xml");
    const articles = xmlParser
.parse(result.data)
.rss.channel.item.map((article: ArticleType): ArticlesQuickPickItem  => {
	return {
		label: article.title,
		detail: article.description,
        link: article.link,
	};
});

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
			vscode.window.showInformationMessage("Happy to hear that");
		  }
		})
	  );
}

export function deactivate() {}
