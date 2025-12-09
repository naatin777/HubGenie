import { BaseCommand, type Command } from "../lib/command.ts";
import { GitService } from "../git/git_service.ts";
import { generateStructuredOutput } from "../utils/openai.ts";
import { selectPrompt } from "../prompt/select.ts";
import { Spinner } from "../prompt/spinner.ts";
import { editText } from "../utils/edit.ts";
import { CommitSchema } from "../schema.ts";
import { COMMIT_SYSTEM_MESSAGE } from "../constants/message.ts";

export class CommitCommand extends BaseCommand {
  name: string = "commit";
  description: string = "Commit changes to the repository";
  commands: Command[] = [];
  async execute(_: (string | number)[]): Promise<void> {
    const spinner = new Spinner("Loading...");
    spinner.start();
    const git = new GitService();
    const diff = await git.diff.getGitDiffStaged();

    if (!diff) {
      spinner.stop();
      console.log("No changes to commit");
      return;
    }

    const result = await generateStructuredOutput(
      [
        {
          role: "system",
          content: COMMIT_SYSTEM_MESSAGE,
        },
        {
          role: "user",
          content: diff,
        },
      ],
      CommitSchema,
      "commit messages",
    );
    spinner.stop();

    if (!result) {
      console.log("No commit messages generated");
      return;
    }

    const answer = await selectPrompt({
      message: "Enter commit messages",
      choices: result.commit_message.map((m) => ({
        name: m.header,
        value: m,
        description: [m.body, m.footer].filter(Boolean).join("\n\n"),
      })),
    });

    const combinedCommitMessage = [answer.header, answer.body, answer.footer]
      .filter(Boolean).join("\n\n");
    const editedCombinedCommitMessage = await editText(combinedCommitMessage);
    if (editedCombinedCommitMessage.trim()) {
      await git.commit.commitWithMessages([editedCombinedCommitMessage]);
      console.log("Commit successful");
    } else {
      console.log("Commit cancelled - empty message");
    }
  }
}
