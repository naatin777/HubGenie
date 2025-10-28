import { getGitDiff } from "../utils/git.ts";
import { getCommitMessage } from "../utils/openai.ts";

export async function commitAction() {
  const diff = await getGitDiff();
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
