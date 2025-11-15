import { GitService } from "../git/git_service.ts";
import { createParsedCompletions } from "../utils/openai.ts";
import { Input } from "@cliffy/prompt";
import { Spinner } from "../utils/spinner.ts";
import z from "zod";

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
            `Act as an expert AI assistant specialized in generating Git commit messages.
            I will provide you with a patch in the Unified Diff Format.
            Your task is to analyze this diff and generate 10 distinct commit message suggestions that accurately describe the changes.`,
        },
        {
          role: "user",
          content: diff,
        },
      ],
      z.object({ commit_message: z.array(z.string()) }),
      "commit messages",
    );
    spinner.stop();
    if (result != null) {
      const message = await Input.prompt({
        message: "Enter commit messages",
        suggestions: result.commit_message,
        default: result.commit_message[0],
        list: true,
        info: true,
      });
      await git.commit.commitWithMessage(message);
      console.log("Commit successful");
    } else {
      console.log("No changes to commit");
    }
  } else {
    spinner.stop();
    console.log("No changes to commit");
  }
}
