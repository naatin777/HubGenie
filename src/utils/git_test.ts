import { getGitDiff, getGitDiffName, GitRunner } from "./git.ts";
import { assertEquals } from "@std/assert";

Deno.test("getGitDiff", async () => {
  const mock: GitRunner = {
    run: (args) => new Promise((resolve) => resolve(args.join(" "))),
  };
  const result = await getGitDiff(mock);
  assertEquals(result, "diff --cached --unified=0 --color=never --no-prefix");
});

Deno.test("getGitDiffName", async () => {
  const mock: GitRunner = {
    run: (args) => new Promise((resolve) => resolve(args.join(" "))),
  };
  const result = await getGitDiffName(mock);
  assertEquals(result, "diff --cached --name-only");
});
