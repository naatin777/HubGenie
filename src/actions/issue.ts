import { createParsedCompletions } from "../utils/openai.ts";
import z from "zod";
import { getConfig } from "../utils/config.ts";

export async function issueAction() {
  const issueOverview = prompt("? Enter the issue overview › ") ?? "";
  const issue = await createParsedCompletions(
    [
      {
        role: "system",
        content:
          "You are an assistant that generates GitHub issues. Based on the issue summary provided by the user, generate the issue title and body.",
      },
      {
        role: "system",
        content: `Please output in ${await getConfig("language") as string}.`,
      },
      {
        role: "user",
        content: issueOverview,
      },
    ],
    z.object({
      issue: z.array(z.object({ title: z.string(), body: z.string() })),
    }),
    "issue",
  );

  for (const item of issue!.issue) {
    console.log(item.title);
    console.log(item.body);
    console.log("\n");
  }

  // const editedIssueList = (await editText(issueList.join("\n"))).split("\n");
  // const title = editedIssueList.shift() ?? "";
  // const body = editedIssueList.join("\n");
  // console.log(title);
  // console.log(body);
}
