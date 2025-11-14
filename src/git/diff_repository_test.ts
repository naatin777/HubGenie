import { assertEquals } from "@std/assert";
import { GitRunner } from "./git_runner.ts";
import { GitDiffRepository } from "./diff_repository.ts";

Deno.test("getGitDiffStaged", async () => {
  const mock: GitRunner = {
    run: (args) => new Promise((resolve) => resolve(args.join(" "))),
  };
  const gitDiffRepository = new GitDiffRepository(mock);
  const result = await gitDiffRepository.getGitDiffStaged();
  assertEquals(result, "diff --cached --unified=0 --color=never --no-prefix");
});

Deno.test("getGitDiffStagedName", async () => {
  const mock: GitRunner = {
    run: (args) => new Promise((resolve) => resolve(args.join(" "))),
  };
  const gitDiffRepository = new GitDiffRepository(mock);
  const result = await gitDiffRepository.getGitDiffStagedName();
  assertEquals(result, "diff --cached --name-only");
});

Deno.test("getStagedFileNames", async () => {
  const mock: GitRunner = {
    run: (_) =>
      new Promise((resolve) =>
        resolve("aaa/bbb.txt\n/ccc/ddd.txt\r\neee.txt\rppp.txt\n\n")
      ),
  };
  const gitDiffRepository = new GitDiffRepository(mock);
  const result = await gitDiffRepository.getStagedFileNames();
  assertEquals(result, ["aaa/bbb.txt", "/ccc/ddd.txt", "eee.txt", "ppp.txt"]);
});

Deno.test("getGitDiffUnstaged", async () => {
  const mock: GitRunner = {
    run: (args) => new Promise((resolve) => resolve(args.join(" "))),
  };
  const gitDiffRepository = new GitDiffRepository(mock);
  const result = await gitDiffRepository.getGitDiffUnstaged();
  assertEquals(result, "diff --unified=0 --color=never --no-prefix");
});

Deno.test("getGitDiffUnstagedNames", async () => {
  const mock: GitRunner = {
    run: (args) => new Promise((resolve) => resolve(args.join(" "))),
  };
  const gitDiffRepository = new GitDiffRepository(mock);
  const result = await gitDiffRepository.getGitDiffUnstagedName();
  assertEquals(result, "diff --name-only");
});

Deno.test("getUntrackedFileNames", async () => {
  const mock: GitRunner = {
    run: (_) =>
      new Promise((resolve) =>
        resolve("aaa/bbb.txt\n/ccc/ddd.txt\r\neee.txt\rppp.txt\n\n")
      ),
  };
  const gitDiffRepository = new GitDiffRepository(mock);
  const result = await gitDiffRepository.getUnStagedFileNames();
  assertEquals(result, ["aaa/bbb.txt", "/ccc/ddd.txt", "eee.txt", "ppp.txt"]);
});
