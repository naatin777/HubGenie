import { GitService } from "../git/git_service.ts";
import { createParsedCompletions } from "../utils/openai.ts";
import { selectPrompt } from "../prompt/select.ts";
import { Spinner } from "../utils/spinner.ts";
import z from "zod";
import { editText } from "../utils/edit.ts";

export async function commitAction() {
  const spinner = new Spinner("Loading...");
  spinner.start();
  const git = new GitService();
  const diff = await git.diff.getGitDiffStaged();
  if (diff) {
    const result = await createParsedCompletions(
      [
        {
          role: "system",
          content:
            `Act as an expert AI assistant specialized in generating Git commit messages adhering to the Conventional Commits specification.

            Your task is to analyze the provided Unified Diff and generate 10 distinct, high-quality commit message suggestions.

            ## Constraints & Formatting Rules
            1.  **Output Format**: You must output strictly valid JSON matching the defined schema.
            2.  **Conventional Commits**: Every suggestion must follow the format \`<type>(<scope>): <subject>\`.
                -   **Types**: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert.
                -   **Scope**: Optional but recommended (e.g., api, auth, ui).
            3.  **Header (\`header\` field)**:
                -   Keep it concise (under 50 characters ideally).
                -   Use the imperative mood (e.g., "add" not "added", "fix" not "fixed").
                -   No period at the end.
                -   Do NOT include the body content here.
            4.  **Body (\`body\` field)**:
                -   Explain *what* and *why* (context), not just *how*.
                -   If the diff is trivial, this can be null or empty string.
                -   Use formatting (e.g., bullet points) if multiple changes are included.
            5.  **Footer (\`footer\` field)**:
                -   Use for "BREAKING CHANGE: ..." or issue references like "Fixes #123".
                -   If not applicable, leave it empty.`,
        },
        {
          role: "user",
          content: diff,
        },
      ],
      z.object({
        commit_message: z.array(
          z.object({
            header: z.string(),
            body: z.string().nullable(),
            footer: z.string().nullable(),
          }),
        ),
      }),
      "commit messages",
    );
    spinner.stop();
    if (result != null) {
      const answer = await selectPrompt({
        message: "Enter commit messages",
        choices: result.commit_message.map((m) => ({
          name: m.header,
          value: m,
          description: [m.body, m.footer].filter(Boolean).join("\n\n"),
        })),
      });
      try {
        const edited = await editText(
          [answer.header, answer.body, answer.footer].filter(Boolean).join(
            "\n\n",
          ),
        );
        if (edited.trim()) {
          await git.commit.commitWithMessages([edited]);
          console.log("Commit successful");
        } else {
          console.log("Commit cancelled - empty message");
        }
      } catch (error) {
        console.error("Error committing changes:", error);
      }
    } else {
      console.log("No changes to commit");
    }
  } else {
    spinner.stop();
    console.log("No changes to commit");
  }
}
