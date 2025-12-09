import { BaseCommand, type Command } from "../lib/command.ts";
import { issueAgent } from "../utils/openai.ts";
import { selectPrompt } from "../prompt/select.ts";
import { getIssueTemplatePath } from "../issue/path.ts";
import {
  parseMarkdownIssueTemplate,
  stringifyMarkdownIssue,
} from "../issue/markdown.ts";
import { Spinner } from "../prompt/spinner.ts";
import { carouselPrompt } from "../prompt/carousel.ts";
import { editText } from "../utils/edit.ts";
import { createIssue } from "../github/issue.ts";
import { ISSUE_SYSTEM_MESSAGE } from "../constants/message.ts";

interface IssueCommandOption {
  help: boolean;
  [key: string]: unknown;
}

export class IssueCommand extends BaseCommand {
  name: string = "issue";
  description: string = "Manage issues in the repository";
  commands: Command[] = [];
  async execute(
    args: (string | number)[],
    options: IssueCommandOption,
  ): Promise<void> {
    console.log(args);
    console.log(options);

    const issueTemplatePath = await getIssueTemplatePath();
    const issueTemplates = issueTemplatePath.markdown.map((markdownPath) =>
      parseMarkdownIssueTemplate(new TextDecoder().decode(
        Deno.readFileSync(markdownPath),
      ))
    );
    if (issueTemplates.length === 0) {
      console.log("No issue templates found.");
      return;
    }
    const issueTemplate = await selectPrompt({
      message: "Select an issue template",
      choices: issueTemplates.map((template) => ({
        name: template.name,
        value: template,
        description: template.about,
      })),
    });
    const issueOverview = prompt("? Enter the issue overview › ") ?? "";
    const spinner = new Spinner("Loading...");
    spinner.start();

    const issues = await issueAgent(
      [
        {
          role: "system",
          content: ISSUE_SYSTEM_MESSAGE
            .replace(/{{issueTemplate.title}}/g, issueTemplate.title)
            .replace(/{{issueTemplate.body}}/g, issueTemplate.body),
        },
        {
          role: "user",
          content:
            `Here is the issue overview provided by the user:\n\n${issueOverview}`,
        },
      ],
    );
    spinner.stop();
    if (issues.issue.length === 0) {
      console.log("No issues found.");
      return;
    }
    const issue = await carouselPrompt({
      message: "Select an issue to edit",
      choices: issues.issue.filter(Boolean).map((item) => ({
        name: item.title,
        value: item,
        description: item.body,
      })),
    });

    const markdown = stringifyMarkdownIssue(issue);
    const editedMarkdown = await editText(markdown);
    const editedIssue = parseMarkdownIssueTemplate(editedMarkdown);

    const issueResponse = await createIssue(
      editedIssue.title,
      editedIssue.body,
    );
    console.log(`Issue created: ${issueResponse.url}`);
  }
}
