import { getGitDiff, GitRunner } from "./git.ts";
import { assertEquals } from "@std/assert";

Deno.test("getGitDiff", async () => {
  const mock: GitRunner = { run: async (args) => await args.join(" ") };
  const result = await getGitDiff(mock);
  assertEquals(result, "diff --cached --unified=0 --color=never --no-prefix");
});
