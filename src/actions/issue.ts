import { createParsedCompletions } from "../utils/openai.ts";
import z from "zod";
import { selectPrompt } from "../prompt/select.ts";
import { getIssueTemplatePath } from "../issue/path.ts";
import {
  parseMarkdownIssueTemplate,
  stringifyMarkdownIssue,
} from "../issue/markdown.ts";
import { Spinner } from "../utils/spinner.ts";
import { carouselPrompt } from "../prompt/carousel.ts";
import { editText } from "../utils/edit.ts";

export async function issueAction() {
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
  const issues = await createParsedCompletions(
    [
      {
        role: "system",
        content: `
      You are an expert Project Manager on GitHub.
      Your task is to generate **10 distinct GitHub issues** based on the user's input.

      # Instructions
      1. **Analyze** the user's input (Issue Overview).
      2. **Break down** the input into **10 separate, actionable tasks or sub-issues**.
      3. For **each** of the 10 issues:
         - **Fill in** the provided Issue Template Body with relevant details.
         - **Generate** a concise and descriptive Title, keeping the format of the provided Template Title.

      # Issue Template
      Title Format: ${issueTemplate.title}
      Body Structure:
      """
      ${issueTemplate.body}
      """
          `.trim(),
      },
      {
        role: "user",
        content:
          `Here is the issue overview provided by the user:\n\n${issueOverview}`,
      },
    ],
    z.object({
      issue: z.array(z.object({ title: z.string(), body: z.string() })),
    }),
    "issue",
  );
  spinner.stop();
  if (!issues?.issue || issues.issue.length === 0) {
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

  console.log(editedIssue.title);
  console.log(editedIssue.body);
  console.log("\n");
}
