import { GitService } from "../utils/git/git_service.ts";
import { getCommitMessage } from "../utils/openai.ts";
import { Input } from "@cliffy/prompt";

export async function commitAction() {
  const git = new GitService()
  const diff = await git.diff.getGitDiff();
  const messages = await getCommitMessage(diff);
  const message = await Input.prompt({
    message: "Enter commit messages",
    suggestions: messages,
    default: messages[0],
    list: true,
    info: true,
  });
  console.log(message);
}
