import {
  getGitDiff,
  getGitDiffName,
  getStagedFileNames,
  GitRunner,
} from "./git.ts";
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

Deno.test("getStagedFileNames", async () => {
  const mock: GitRunner = {
    run: (_) =>
      new Promise((resolve) =>
        resolve("aaa/bbb.txt\n/ccc/ddd.txt\r\neee.txt\rppp.txt\n\n")
      ),
  };
  const result = await getStagedFileNames(mock);
  assertEquals(result, ["aaa/bbb.txt", "/ccc/ddd.txt", "eee.txt", "ppp.txt"]);
});
