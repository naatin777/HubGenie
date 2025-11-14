import { GitService } from "../git/git_service.ts";
import { getCommitMessage } from "../utils/openai.ts";
import { Input } from "@cliffy/prompt";
import { Spinner } from "../utils/spinner.ts";

export async function commitAction() {
  const spinner = new Spinner("Loading...");
  spinner.start();
  const git = new GitService();
  const diff = await git.diff.getGitDiffStaged();
  const messages = await getCommitMessage(diff);
  spinner.stop();
  const message = await Input.prompt({
    message: "Enter commit messages",
    suggestions: messages,
    default: messages[0],
    list: true,
    info: true,
  });
  console.log(message);
}
