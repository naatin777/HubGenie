import { runAgentLoop } from "../utils/openai.ts";
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
import { createIssue } from "../github/issue.ts";

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

  const IssuesResultSchema = z.array(
    z.object({
      title: z.string(),
      body: z.string(),
    }),
  );
  const AgentSchema = z.object({
    status: z.enum(["question", "final_answer"]),
    question: z.string().nullable(),
    final_answer: IssuesResultSchema.nullable(),
  });

  const issues: z.infer<typeof IssuesResultSchema> = await runAgentLoop(
    [
      {
        role: "system",
        content: `
          You are an expert, meticulous Technical Project Manager on GitHub.
          Your goal is to break down a project into **10 distinct, highly detailed GitHub issues**.

          # CRITICAL RULE: DO NOT ASSUME
          **You must NOT make assumptions about technical details, user scope, or features if they are not explicitly stated in the input.**
          If the user's input is vague (e.g., "Make a todo app"), you **MUST** set the status to "question" to clarify requirements before generating issues.

          # Clarification Checklist
          Before generating issues, check if the user provided:
          - **Tech Stack**: (e.g., React, Next.js, Go, Python, DB type)
          - **Specific Features**: (e.g., Auth, Payments, specific UI requirements)
          - **Target Audience**: (Who is this for?)
          - **Scope**: (MVP only? Full production?)

          If ANY of the above are missing or unclear, ask the user specifically about them.

          # Process
          1. **Analyze** the user's input deeply.
          2. **Check** against the Clarification Checklist.
          3. **Decision**:
             - If information is missing -> Set status to "question" and ask strictly about the missing parts.
             - If (and ONLY IF) information is sufficient -> Set status to "final_answer" and generate the 10 issues.

          # Instructions for Generation (Only when sufficient)
          1. **Break down** the input into **10 separate, actionable tasks**.
          2. For **each** issue:
             - **Fill in** the Issue Template Body.
             - **Generate** a concise Title.

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
    AgentSchema,
    "issue",
  );
  spinner.stop();
  if (issues.length === 0) {
    console.log("No issues found.");
    return;
  }
  const issue = await carouselPrompt({
    message: "Select an issue to edit",
    choices: issues.filter(Boolean).map((item) => ({
      name: item.title,
      value: item,
      description: item.body,
    })),
  });

  const markdown = stringifyMarkdownIssue(issue);
  const editedMarkdown = await editText(markdown);
  const editedIssue = parseMarkdownIssueTemplate(editedMarkdown);

  const issueResponse = await createIssue(editedIssue.title, editedIssue.body);
  console.log(`Issue created: ${issueResponse.url}`);
}
